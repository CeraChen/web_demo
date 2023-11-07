import React from "react"
import './css/recordBtn.css'

let leftDataList = [], rightDataList = [];
let audioContext = null;
let mediaNode = null, jsNode = null;
let mStream = null;
let startTime = null, endTime = null;

function mergeArray (list) {
    let length = list.length * list[0].length;
    let data = new Float32Array(length),
        offset = 0;
    for (let i = 0; i < list.length; i++) {
        data.set(list[i], offset);
        offset += list[i].length;
    }
    return data;
}

function interleaveLeftAndRight (left, right) {
    let totalLength = left.length + right.length;
    let data = new Float32Array(totalLength);
    for (let i = 0; i < left.length; i++) {
        let k = i * 2;
        data[k] = left[i];
        data[k + 1] = right[i];
    }
    return data;
}

function createWavFile (audioData) {
    const WAV_HEAD_SIZE = 44;
    let buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
        // 需要用一个view来操控buffer
        view = new DataView(buffer);
    // 写入wav头部信息
    // RIFF chunk descriptor/identifier
    writeUTFBytes(view, 0, 'RIFF');
    // RIFF chunk length
    view.setUint32(4, 44 + audioData.length * 2, true);
    // RIFF type
    writeUTFBytes(view, 8, 'WAVE');
    // format chunk identifier
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    // sample rate
    view.setUint32(24, 44100, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, 44100 * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2 * 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data sub-chunk
    // data chunk identifier
    writeUTFBytes(view, 36, 'data');
    // data chunk length
    view.setUint32(40, audioData.length * 2, true);
    // 写入PCM数据
    let length = audioData.length;
    let index = 44;
    let volume = 1;
    for (let i = 0; i < length; i++) {
        view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
        index += 2;
    }
    return buffer;
}

function writeUTFBytes (view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) { 
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}


export default class RecordBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recoding: false,
            relpay: null,
        };
        this.render = this.render.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.playRecord = this.playRecord.bind(this);
    }

    onAudioProcess (event) {
        let audioBuffer = event.inputBuffer;
        let leftChannelData = audioBuffer.getChannelData(0),
            rightChannelData = audioBuffer.getChannelData(1);
        // 需要克隆一下
        leftDataList.push(leftChannelData.slice(0));
        rightDataList.push(rightChannelData.slice(0));
    }


    createJSNode (mContext) {
        const BUFFER_SIZE = 4096;
        const INPUT_CHANNEL_COUNT = 2;
        const OUTPUT_CHANNEL_COUNT = 2;
        // createJavaScriptNode已被废弃
        let creator = mContext.createScriptProcessor || mContext.createJavaScriptNode;
        creator = creator.bind(mContext);
        return creator(BUFFER_SIZE,
                        INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
    }
    
    
    
    playRecord () {
        let leftData = mergeArray(leftDataList);
        let rightData = mergeArray(rightDataList);
        let allData = interleaveLeftAndRight(leftData, rightData);
        let arrayBuffer = createWavFile(allData);

        let blob = new Blob([new Uint8Array(arrayBuffer)]);
        let blobUrl = URL.createObjectURL(blob);
        this.setState({ relpay: blobUrl});
    }

    uploadRecord (){
        let leftData = mergeArray(leftDataList);
        let rightData = mergeArray(rightDataList);
        let allData = interleaveLeftAndRight(leftData, rightData);
        let arrayBuffer = createWavFile(allData);

        let blob = new Blob([new Uint8Array(arrayBuffer)]);
        const formData = new FormData();
        console.log((endTime - startTime) || 0);
        console.log(Date.now());
        formData.append('audio', blob);
        formData.append('duration', (endTime - startTime) || 0);
        formData.append('time', Date.now());
        formData.append('part', 'A');

        fetch('http://143.89.162.149:80/upload', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        // .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
        // .then(function(response) {
        //     console.log('Successfully uploaded!');
        // })
        // .catch(function(error) {
        //     console.error('Fail to upload:', error);
        // });
    }
    
    
    handleClick() {
        console.log('here!');
        var current_recording = !this.state.recoding;

        if (current_recording){
            leftDataList = [];
            rightDataList = [];
            window.navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: 44100, // 采样率
                        channelCount: 2,   // 声道
                        volume: 1.0        // 音量
                    }
                }).then(mediaStream => {
                    // console.log(mediaStream);
                    // this.beginRecord(mediaStream);
                    mStream = mediaStream;

                    audioContext = new (window.AudioContext || window.webkitAudioContext);
                    mediaNode = audioContext.createMediaStreamSource(mediaStream);
                    // 创建一个jsNode
                    jsNode = this.createJSNode(audioContext);
                    // 需要连到扬声器消费掉outputBuffer，process回调才能触发
                    // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音
                    jsNode.connect(audioContext.destination);
                    jsNode.onaudioprocess = this.onAudioProcess;
                    // 把mediaNode连接到jsNode
                    mediaNode.connect(jsNode);
                    startTime = Date.now();

                }).catch(err => {
                    console.error(err);
                });
    
        }
        else{
             // 停止录音
            mStream.getAudioTracks()[0].stop();
            endTime = Date.now();
            mediaNode.disconnect();
            jsNode.disconnect();
            console.log(leftDataList, rightDataList);
        }
        this.setState({ recoding: current_recording,
                        relpay: null });
    }
    

    render() {
        var text = this.state.recoding ? 'stop' : 'start';
        console.log(this.state.recoding);
        if (!this.state.recoding && leftDataList.length && rightDataList.length){
            return (
                <div>
                    <button className="button" onClick={this.handleClick}>{text}</button>
                    <button className="button" onClick={this.playRecord}>replay</button>
                    <button className="button" onClick={this.uploadRecord}>upload</button>
                    <audio src={this.state.relpay} autoPlay></audio>
                </div>
                );
        }
        else{
            return (
                <div>
                    <button className="button" onClick={this.handleClick}>{text}</button>
                </div>
                );
        }
    }
};
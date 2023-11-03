import React from "react"
let recorder;
let chunks;

export default class RecordBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recoding: false,
            relpay: null,
        };
        this.render = this.render.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                recorder = new MediaRecorder(stream);
                recorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                };
                recorder.start();
            })
            .catch(function(err) {
                console.log('Unable to access audio device: ', err);
            });
    }

    stopRecording() {
        recorder.stop();
    }

    uploadRecording() {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const formData = new FormData();
        formData.append('audio', blob);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            console.log('Successfully upload the audio!');
        })
        .catch(function(error) {
            console.error('Fail to upload the audio!', error);
        });
    }

    reset() {
        recorder = null;
        chunks = [];
    }

    handleClick() {
        console.log('here!');
        var current_recording = !this.state.recoding;

        if (current_recording){
            this.reset();
            this.startRecording();
        }
        else{
            this.stopRecording();
            this.uploadRecording();
            this.playRecord();
        }
        this.setState({ recoding: current_recording });
    }
    //         window.navigator.mediaDevices.getUserMedia({
    //             audio: {
    //                 sampleRate: 44100, // 采样率
    //                 channelCount: 2,   // 声道
    //                 volume: 1.0        // 音量
    //             }
    //         }).then(mediaStream => {
    //             // console.log(mediaStream);
    //             this.beginRecord(mediaStream);
    //         }).catch(err => {
    //             console.error(err);
    //         });
    //     }
    //     else{

    //     }
    // }

    // beginRecord (mediaStream) {
    //     let audioContext = new (window.AudioContext || window.webkitAudioContext);
    //     let mediaNode = audioContext.createMediaStreamSource(mediaStream);
    //     // 创建一个jsNode
    //     let jsNode = createJSNode(audioContext);
    //     // 需要连到扬声器消费掉outputBuffer，process回调才能触发
    //     // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音
    //     jsNode.connect(audioContext.destination);
    //     jsNode.onaudioprocess = onAudioProcess;
    //     // 把mediaNode连接到jsNode
    //     mediaNode.connect(jsNode);
    // }

    // createJSNode (audioContext) {
    //     const BUFFER_SIZE = 4096;
    //     const INPUT_CHANNEL_COUNT = 2;
    //     const OUTPUT_CHANNEL_COUNT = 2;
    //     // createJavaScriptNode已被废弃
    //     let creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode;
    //     creator = creator.bind(audioContext);
    //     return creator(BUFFER_SIZE,
    //                     INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
    // }
    
    playRecord () {
        let blob = new Blob([new Uint8Array(chunks)]);
        let blobUrl = URL.createObjectURL(blob);
        this.setState({ relpay: blobUrl});
    }
    

    render() {
        var text = this.state.recoding ? 'stop' : 'start';
        console.log(this.state.recoding);
        return (
            <div>
                <button onClick={this.handleClick}>{text}</button>
                <audio src={this.state.relpay} autoplay></audio>
            </div>
    )}
};
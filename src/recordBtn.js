import React from "react"
import './css/recordBtn.css'
import questions from './text/questions.json'

let PART_A = 0;
let PART_B = 1;

let leftDataList = [], rightDataList = [];
let audioContext = null;
let mediaNode = null, jsNode = null;
let mStream = null;
let startTime = null, endTime = null, lastTime = null;
let interval = 0;
let SAMPLERATE = 44100;
let mTimer = null;
let mBlobUrl = null;
let mDuration = null;
let mCount = 0;
let mPrepareTime = 1000 * 60 * 10;
let mInterval = 1000;


let playSVG = <svg t="1699443026260" className="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9674" width="30" height="30"><path d="M906.453333 378.453333a32 32 0 0 1-32-32v-185.6a32 32 0 1 1 64 0v185.6a32 32 0 0 1-32 32z" p-id="9675"></path><path d="M906.453333 378.453333h-185.813333a32 32 0 0 1 0-64h185.813333a32 32 0 1 1 0 64z" p-id="9676"></path><path d="M513.28 969.6a458.88 458.88 0 1 1 414.506667-655.36A32 32 0 1 1 869.973333 341.333333a394.666667 394.666667 0 1 0 35.413334 214.613334 32.426667 32.426667 0 0 1 35.413333-28.16 32 32 0 0 1 28.16 35.413333 458.24 458.24 0 0 1-455.68 406.4z" p-id="9677"></path><path d="M408.533333 697.173333a14.293333 14.293333 0 0 1-6.613333-1.493333 13.653333 13.653333 0 0 1-7.253333-13.013333V341.333333a13.44 13.44 0 0 1 7.466666-12.16 13.866667 13.866667 0 0 1 14.08 0l249.813334 170.666667a14.506667 14.506667 0 0 1 5.973333 11.52 14.08 14.08 0 0 1-5.973333 11.306667l-249.813334 170.666666a14.72 14.72 0 0 1-7.68 3.84z"  p-id="9678"></path></svg>
{/* <svg t="1699433289982" class="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4004" width="20" height="20"><path d="M917.8112 450.4064L160.5888 8.5504C151.3728 3.1744 141.824 0 130.944 0 101.2736 0 77.0816 24.0128 77.0816 53.3248H76.8v917.3504h0.256C77.056 999.9872 101.2992 1024 130.944 1024c11.1616 0 20.4032-3.7376 30.464-9.0624l756.4288-441.344A79.3344 79.3344 0 0 0 947.2 512c0-24.8064-11.4176-46.6688-29.3888-61.5936z" p-id="4005"></path></svg>; */}
let recordSVG = <svg t="1699433820701" className="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5858" width="26" height="26"><path d="M841.142857 402.285714v73.142857c0 169.142857-128 308.553143-292.571428 326.838858V877.714286h146.285714c20.004571 0 36.571429 16.566857 36.571428 36.571428s-16.566857 36.571429-36.571428 36.571429H329.142857c-20.004571 0-36.571429-16.566857-36.571428-36.571429s16.566857-36.571429 36.571428-36.571428h146.285714v-75.446857c-164.571429-18.285714-292.571429-157.696-292.571428-326.838858v-73.142857c0-20.004571 16.566857-36.571429 36.571428-36.571428s36.571429 16.566857 36.571429 36.571428v73.142857c0 141.129143 114.870857 256 256 256s256-114.870857 256-256v-73.142857c0-20.004571 16.566857-36.571429 36.571429-36.571428s36.571429 16.566857 36.571428 36.571428z m-146.285714-219.428571v292.571428c0 100.571429-82.285714 182.857143-182.857143 182.857143s-182.857143-82.285714-182.857143-182.857143V182.857143c0-100.571429 82.285714-182.857143 182.857143-182.857143s182.857143 82.285714 182.857143 182.857143z" p-id="5859"></path></svg>
let uploadSVG = <svg t="1699441617557" className="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8697" width="33" height="33"><path d="M810.666667 170.666667H213.333333c-47.146667 0-85.333333 38.186667-85.333333 85.333333v512c0 47.146667 38.186667 85.333333 85.333333 85.333333h170.666667v-85.333333h-170.666667V341.333333h597.333334v426.666667h-170.666667v85.333333h170.666667c47.146667 0 85.333333-38.186667 85.333333-85.333333V256c0-47.146667-38.186667-85.333333-85.333333-85.333333zM512 426.666667l-170.666667 170.666666h128v256h85.333334V597.333333h128l-170.666667-170.666666z" p-id="8698"></path></svg>
{/* <svg t="1699434224909" class="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8552" width="50" height="28"><path d="M268.190476 146.285714h48.761905v73.118476L268.190476 219.428571v609.52381h243.809524v73.142857H268.190476a73.142857 73.142857 0 0 1-73.142857-73.142857V219.428571a73.142857 73.142857 0 0 1 73.142857-73.142857z m442.441143 460.01981l125.366857 125.366857-51.712 51.712-37.546666-37.571048-0.024381 153.283048h-73.142858V746.788571l-36.571428 36.59581-51.736381-51.687619 125.366857-125.391238zM560.761905 536.380952v73.142858h-219.428572v-73.142858h219.428572z m195.047619-390.095238a73.142857 73.142857 0 0 1 73.142857 73.142857l-0.024381 341.333334h-73.142857L755.809524 219.428571h-48.761905V146.285714h48.761905z m-73.142857 243.809524v73.142857H341.333333v-73.142857h341.333334zM585.142857 73.142857a73.142857 73.142857 0 0 1 73.142857 73.142857v48.761905a73.142857 73.142857 0 0 1-73.142857 73.142857h-146.285714a73.142857 73.142857 0 0 1-73.142857-73.142857V146.285714a73.142857 73.142857 0 0 1 73.142857-73.142857h146.285714z m0 73.142857h-146.285714v48.761905h146.285714V146.285714z" p-id="8553"></path></svg> */}
let stopSVG = <svg t="1699443695102" className="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11052" width="30" height="30"><path d="M512 42.666667a469.333333 469.333333 0 1 0 469.333333 469.333333A469.333333 469.333333 0 0 0 512 42.666667z m0 864a394.666667 394.666667 0 1 1 394.666667-394.666667 395.146667 395.146667 0 0 1-394.666667 394.666667z" p-id="11053"></path><path d="M365.333333 365.333333m5.333334 0l282.666666 0q5.333333 0 5.333334 5.333334l0 282.666666q0 5.333333-5.333334 5.333334l-282.666666 0q-5.333333 0-5.333334-5.333334l0-282.666666q0-5.333333 5.333334-5.333334Z" p-id="11054"></path></svg>
let pauseSVG = <svg t="1699620463202" className="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1591" width="20" height="20"><path d="M209.645253 863.934444l201.049992 0 0-703.866842L209.645253 160.067602 209.645253 863.934444zM611.804588 863.934444l201.113437 0 0-703.866842L611.804588 160.067602 611.804588 863.934444z" p-id="1592"></path></svg>
let groupSVG = <svg t="1700836759608" class="button_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4081" width="27" height="24"><path d="M535.771429 466.285714c53.028571-40.228571 85.942857-102.4 85.942857-173.714285 0-120.685714-98.742857-219.428571-219.428572-219.428572S182.857143 171.885714 182.857143 292.571429c0 71.314286 34.742857 133.485714 85.942857 173.714285C153.6 517.485714 73.142857 632.685714 73.142857 768v137.142857C73.142857 930.742857 93.257143 950.857143 118.857143 950.857143h568.685714c25.6 0 45.714286-20.114286 45.714286-45.714286V768c-1.828571-133.485714-82.285714-250.514286-197.485714-301.714286z" p-id="4082"></path><path d="M755.2 468.114286c53.028571-40.228571 87.771429-104.228571 87.771429-175.542857 0-120.685714-98.742857-219.428571-219.428572-219.428572h-7.314286c-16.457143 0-29.257143 10.971429-34.742857 27.428572-3.657143 14.628571 1.828571 31.085714 14.628572 40.228571 51.2 34.742857 82.285714 91.428571 82.285714 151.771429 0 56.685714-25.6 109.714286-73.142857 144.457142-10.971429 7.314286-16.457143 20.114286-14.628572 32.914286 1.828571 12.8 9.142857 23.771429 21.942858 29.257143 3.657143 1.828571 9.142857 3.657143 12.8 7.314286 0 0 1.828571 0 1.828571 1.828571 0 0 1.828571 0 1.828571 1.828572 96.914286 51.2 157.257143 149.942857 157.257143 259.657142v138.971429c-1.828571 10.971429 0 21.942857 7.314286 29.257143 7.314286 9.142857 16.457143 12.8 27.428571 12.8h84.114286c25.6 0 45.714286-20.114286 45.714286-45.714286V768c0-131.657143-80.457143-248.685714-195.657143-299.885714z" p-id="4083"></path></svg>


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
            part: props.part,
            isStop: true,
            isPause: false,
            isRecording: false,
            isReplaying: false,
            isPreparing: false,//(props.part === PART_A)? true : false,
            replayTime: "--:--.---",
            replayUrl: null,

            question_num: props.q_num,
            isHidden: true,
            text: questions.question_text["q" + props.q_num.toString()],
        };
        this.render = this.render.bind(this);
        this.startOrStop = this.startOrStop.bind(this);
        this.resumeOrPause = this.resumeOrPause.bind(this);
        this.replayRecord = this.replayRecord.bind(this);
        this.autoStopReplayRecord = this.autoStopReplayRecord.bind(this);
        this.countDownOnce = this.countDownOnce.bind(this);
        this.toStartPrepare = this.toStartPrepare.bind(this);
        this.skipPrepare = this.skipPrepare.bind(this);
        
        
        leftDataList = [];
        rightDataList = [];
        mCount = 0;
        mPrepareTime = 1000 * 60 * 10;
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

    autoStopReplayRecord() {
        console.log("autoStop");
        window.clearInterval(mTimer);
        this.setState({isReplaying: false,
                        replayTime: mDuration});
    }


    componentDidUpdate() {
        var ad = document.getElementById("audio");
        if(ad && mDuration == null){            
            console.log("audio mounted")
            console.log(ad);

            ad.onended = this.autoStopReplayRecord;
            ad.onpause = this.autoStopReplayRecord;
            ad.onplay = function() {
                console.log('play');

                mTimer = window.setInterval(() => {                    
                    var cur_time = ad.currentTime;
                    console.log('now' + parseFloat(cur_time));
                    console.log(ad.duration);
                    var secs = cur_time;
                    var res = parseInt(cur_time*1000) % 1000;
                    var mins = parseInt(secs / 60);
                    secs = parseInt(secs) % 60;
                    mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
                    secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
                    res = (res < 10)? ('0' + res.toString()) : res.toString();
                    
                    var cur_span = document.getElementById("timing");
                    if(cur_span){
                        cur_span.innerText = mins + ":" + secs + "." + res; //" / " + (mDuration.substr(0, mDuration.length - 4) || null);
                    }
                }, 80);
            };

            ad.ondurationchange = function() {
                if(ad.duration){
                    var duration = ad.duration;
                    console.log(ad.duration);
                    var secs = duration;
                    var res = parseInt(duration * 1000) % 1000;
                    var mins = parseInt(secs / 60);
                    secs = parseInt(secs) % 60;
                    mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
                    secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
                    res = (res < 10)? ('0' + res.toString()) : res.toString();
                    mDuration = mins + ":" + secs + "." + res;
                    console.log("mDuration");
                    console.log(mDuration);
        
                    var dur_span = document.getElementById("duration");
                    if(dur_span){
                        dur_span.innerText = mDuration;
                    }
                }
            }
          
           
        }

        var countdown = document.getElementById("countdown");
        if(countdown){ 
            // countdown.style.display = "inline";
            var mins = parseInt(mPrepareTime/(1000 * 60));
            var secs = parseInt((mPrepareTime % (1000 * 60))/1000);
            mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
            secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
            try{
                countdown.innerText = mins + ':' + secs;
            } catch(error){
                console.log(error);
            }

            mTimer = setTimeout(this.countDownOnce, mInterval);
            startTime = Date.now();
        }

    }

    toStartPrepare() {
        this.setState({
            isPreparing: true,
            isHidden: false,
        })
    }


    skipPrepare() {
        if(mTimer != null) {
            console.log("OUT!");
            clearTimeout(mTimer);
            this.startOrStop();
        }
    }
    
    
    replayRecord() {
        var ad = document.getElementById("audio");

        if(this.state.isReplaying){
            ad.pause();
        }
        else{
            console.log("replay Record");
            ad.play();
            this.setState({isReplaying: true});
        }
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
        formData.append('duration', (endTime - startTime - interval) || 0);
        formData.append('time', Date.now());
        formData.append('part', 'A');

        fetch('http://143.89.191.58:2077/upload', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then((result) => {
          console.log("Success:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    resumeOrPause() {
        console.log('resumeOrPause!');
        var toResumeRecording = this.state.isPause;

        if (toResumeRecording){
            // Resume recording
            window.navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: SAMPLERATE, // 采样率
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
                    interval += (Date.now() - lastTime);
                    // 把mediaNode连接到jsNode
                    mediaNode.connect(jsNode);

                }).catch(err => {
                    console.error(err);
                });
    
        }
        else{
             // Pause recording
            mStream.getAudioTracks()[0].stop();
            lastTime = Date.now();
            mediaNode.disconnect();
            jsNode.disconnect();
            console.log(leftDataList, rightDataList);
        }

        this.setState({ isRecording: toResumeRecording,
                        isPause: !toResumeRecording,
                        relpay: null });
    }
    
    
    startOrStop() {
        console.log('startOrStop!');
        var toStartRecording = this.state.isStop;
        if(mTimer != null) {
            clearTimeout(mTimer);
        }


        if (toStartRecording){
            // Start recording 
            var timeLimit = (this.state.part === PART_A)? 3 : 1;           
            mTimer = setTimeout(this.startOrStop, 1000 * 60 * timeLimit);

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
                    interval = 0;
                    lastTime = null;
                    mDuration = null;

                }).catch(err => {
                    console.error(err);
                });
    
        }
        else{
             // Stop recording
            if(this.state.isRecording){
                mStream.getAudioTracks()[0].stop();
                endTime = Date.now();
                if(lastTime != null){
                    interval += (endTime - lastTime);
                }
                mediaNode.disconnect();
                jsNode.disconnect();
                console.log(leftDataList, rightDataList);
            }
            
            let leftData = mergeArray(leftDataList);
            let rightData = mergeArray(rightDataList);
            let allData = interleaveLeftAndRight(leftData, rightData);
            let arrayBuffer = createWavFile(allData);
            let blob = new Blob([new Uint8Array(arrayBuffer)]);
            this.state.replayUrl = URL.createObjectURL(blob);
        }

        this.setState({ isStop: !toStartRecording,
                        isPause: false,
                        isRecording: toStartRecording,
                        isPreparing: false,
                        isHidden: false});
    }

    countDownOnce(){
        mCount ++;
        var offset = Date.now() - (startTime + mCount * mInterval);
        console.log("start");
        console.log(startTime);
        console.log("here");
        console.log(offset);
        var nextTime = mInterval - offset;
        if (nextTime < 0) { 
            nextTime = 0 
        };
        mPrepareTime -= mInterval;
        
        var countdown = document.getElementById("countdown");
        var mins = parseInt(mPrepareTime/(1000 * 60));
        var secs = parseInt((mPrepareTime % (1000 * 60))/1000);
        mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
        secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();

        try{
            countdown.innerText = mins + ':' + secs;

            console.log("Offset: " + offset + "ms, next count in " + nextTime + "ms, left prepare time" + mPrepareTime + "ms");
            if(mPrepareTime <= 0){
                console.log("OUT!");
                clearTimeout(mTimer);
                this.startOrStop();
            }else{
                clearTimeout(mTimer);
                mTimer = setTimeout(this.countDownOnce, nextTime);
            }

        } catch(error){
            console.log(error);
            clearTimeout(mTimer);
        }

    }
    
    // switchPart() {
    //     var other_part = (this.state.part === PART_A)? PART_B : PART_A;
    //     this.setState({ part: other_part});
    // }
    

    render() {
        var mQuestion;
        
        if(this.state.isHidden) {
            console.log("question hidden render once!");
            var mPart = (this.state.part === PART_A)? "Part A" : "Part B";
            var mText = (this.state.part === PART_A)? "You will have 10 minutes to prepare, click the button to start:" :
                        "You will have 1 minute to answer the following question, click the button to start:";
            mQuestion = <div id="question_area">
                            <p id="part">{mPart}</p>
                            <p id="notice">{mText}</p>
                        </div>;
        }
        else {
            if (this.state.part === PART_A){
                // console.log(this.state.text);
                console.log(this.state.text["partA"]);
                mQuestion = <div id="question_area">
                                <p id="part">Part A</p>
                                {/* <div className="tooltip-container">
                                    <span id="part" onClick={this.switchPart}>Part A</span>
                                    <span className="tooltip-text">Click to switch Part A/B</span>
                                </div> */}
                                <div className="toHide">
                                    <p id="intro">{this.state.text["source"]}</p>
                                    <p id="title">{this.state.text["title"]}</p>
                                    <p id="content">{this.state.text["content"]}</p>
                                    <ul>
                                        {this.state.text["partA"].map(item => <li key={item.id} className="partA_questions">{item.text}</li>)}
                                    </ul>
                                </div>
                            </div>;
            }
            else{
                var partB_question_list = this.state.text["partB"];
                var idx = parseInt(Math.random()*partB_question_list.length);
                mQuestion = <div id="question_area">
                                <p id="part">Part B</p>
                                <div className="toHide">
                                    <p id="intro">You have 1 minute to respond:</p>
                                    {/* <div className="tooltip-container">
                                        <span id="part" onClick={this.switchPart}>Part B</span>
                                        <span className="tooltip-text">Click to switch Part A/B</span>
                                    </div> */}
                                    <p id="partB_question">{partB_question_list[idx]["text"]}</p>
                                    {/* <ol>
                                        {this.state.text["partB"].map(item => <li key={item.id} className="sub_questions">{item.text}</li>)}
                                    </ol> */}
                                </div>
                            </div>;
            }
        }


        console.log(this.state.isStop);
        console.log(this.state.isPause);

        if (this.state.isPreparing) {
            return (
                <div>
                    {mQuestion}
                    <div className="btn_div">
                        <button className="button" onClick={this.skipPrepare}>
                            <span id="countdown"></span><span className="label">skip</span>
                        </button>
                    </div>
                </div>
            )
        }

        if (this.state.isStop && leftDataList.length && rightDataList.length){
            var replayBtn = (this.state.isReplaying)?
                            (<button className="button" id="stop_replay_button" onClick={this.replayRecord}>
                                {stopSVG} <span id="timing">{this.state.replayTime}</span> <span className="label">stop</span>
                            </button>) :
                            (<button className="button" id="replay_button" onClick={this.replayRecord}>
                                {playSVG} <span id="duration">{this.state.replayTime}</span> <span className="label">replay</span>
                            </button>);

            return (
                <div>
                    {mQuestion}
                    <div className="btn_div">
                        <button className="button" onClick={this.startOrStop}>
                            {recordSVG}<span className="label">record</span>
                        </button>
                        {replayBtn}
                        <button className="button" onClick={this.uploadRecord}>
                            {uploadSVG}<span className="label">upload</span>
                        </button>
                        <audio id="audio" src={this.state.replayUrl} preload="metadata"></audio>                    
                    </div>
                </div>
                );
        }
        else{
            if(this.state.isStop){
                if(this.state.part === PART_A) {
                    return (
                        <div>
                            {mQuestion}
                            <div className="btn_div">
                                <button className="button" id="startBtn" onClick={this.toStartPrepare}>
                                    {groupSVG}<span className="label">start</span>
                                </button>
                            </div>
                        </div>
                        );
                }
                else {
                    return (
                        <div>
                            {mQuestion}
                            <div className="btn_div">
                                <button className="button" id="startBtn" onClick={this.startOrStop}>
                                    {recordSVG}<span className="label">start</span>
                                </button>
                            </div>
                        </div>
                        );
                }
            }
            else{
                console.log("next button");
                var mSvg = (this.state.isPause)? recordSVG : pauseSVG;
                var mText = (this.state.isPause)? "resume" : "pause";

                return (
                    <div>
                        {mQuestion}
                        <div className="btn_div">
                            <button className="button" id="pause_resume_button" onClick={this.resumeOrPause}>
                                {mSvg}<span className="label">{mText}</span>
                            </button>
                            <button className="button" id="stop_button" onClick={this.startOrStop}>
                                {stopSVG}<span className="label">stop</span>
                            </button>
                        </div>
                    </div>
                    );
            }
        }
        
    }
};
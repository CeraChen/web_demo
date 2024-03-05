import React from "react";
import questions from '../text/questions.json';
import WaitDialog from "./wait_dialog";
import '../css/mocktest.css';
import '../css/button.css';


const PART_A = 0;
const PART_B = 1;

const WEAK = 0;
const STRONG = 1;

const OPENING = 0;
const PREPARING = 1;
const INTERRUPTING = 2;
const PLAYING = 3;
const QUESTIONING = 4;
const ANSWERING = 5;

const intervalTime = 1000;
const prepareTime = 1000 * 60 * 10;
const answerTimePartB = 1000 * 60;
const answerTimePartA = 1000 * 60 * 2;
const apiURL = process.env.REACT_APP_API_URL
const mSVG = <svg t="1703230099825" className="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4207" width="27" height="30"><path d="M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z" p-id="4208"></path></svg>;

let mTimer = null;
let mCount, startTime, leftTime;
// let isDragging = false;
let paperShown = true;
let mStream = null;

// let mediaRecorder; // 用于存储 MediaRecorder 对象
let videoRecorder;
let audioRecorder;
let videoChunks = [];
let audioChunks = [];
let videoStopped = false;
let audioStopped = false;
// let recordedChunks = []; // 存储录制的视频块
// let videoUrl = null;
// let audioUrl = null;
// let videoStartTime;
// let videoStopTime;

let debug_part;



export default class MockTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: props.part,
            school: localStorage.getItem("school"),
            name: localStorage.getItem("name"),
            q_num: localStorage.getItem("q_num"),
            q_type: localStorage.getItem("q_type"),
            text: questions.question_text["q" + localStorage.getItem("q_num").toString()],
            stage: (props.part === PART_A)? OPENING : QUESTIONING,
            waiting: false,
        };
        this.render = this.render.bind(this);
        this.countDownOnce = this.countDownOnce.bind(this);
        this.skipPrepare = this.skipPrepare.bind(this);
        this.startRecordVideo = this.startRecordVideo.bind(this);
        this.handleMediaStop = this.handleMediaStop.bind(this);

        debug_part = this.state.part;
        console.log("debug_part is ", debug_part);


        leftTime = (props.part === PART_A)? prepareTime : answerTimePartB;
        mTimer = null;
        mCount = 0;
        console.log("this.state.q_num");
        console.log(this.state.q_num);
        console.log("this.state.q_type");
        console.log(this.state.q_type);
        console.log("this.state.school");
        console.log(this.state.school);
        console.log("this.state.name");
        console.log(this.state.name);
    }


    componentDidMount() {
        if(this.state.stage === OPENING) {
            const videoPlayer = document.getElementById("video_player");
            videoPlayer.onended = () => {
                this.setState({
                    stage: PREPARING
                });
            }
        }


        if(this.state.stage === QUESTIONING ) {
            const leftVideoPlayer = document.getElementById("left_video_player");

            leftVideoPlayer.onended = () => {
                try {
                    const tracks = mStream.getTracks();
                    const trackPromises = tracks.map((track) => track.stop());

                    Promise.all(trackPromises)
                            .then(() => {
                                console.log("all tracks stopped!");
                                this.setState({
                                    stage: ANSWERING,
                                });
                            })
                            .catch((error) => {
                                console.error(error);
                            });


                    // mStream.getTracks().forEach((track) => track.stop());
                    // console.log("release");
                } catch(error) {
                    console.log("errors when releasing tracks (Part B switching)")
                    console.log(error);
                }

                // this.setState({
                //     stage: ANSWERING,
                // });
            };

            this.startCamera();
        }
    }

    componentWillUnmount() {
        console.log("will unmount");
        //弹窗阻止退出

        try {
            clearTimeout(mTimer);
            mTimer = null;
        } catch(error) {
            console.log("error when clearing timer");
            console.log(error);
        }

        this.stopRecordVideo();
        // window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.stage === PREPARING && this.state.stage !== prevState.stage) {
            console.log("did mount...");
            var countdown = document.getElementById("countdown");
            if(countdown && (mTimer === null)){
                var mins = parseInt(leftTime/(1000 * 60));
                var secs = parseInt((leftTime % (1000 * 60))/1000);
                mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
                secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
                try{
                    countdown.innerText = mins + ':' + secs;
                    console.log(mins + ':' + secs);
                } catch(error){
                    console.log(error);
                }

                mTimer = setTimeout(this.countDownOnce, intervalTime);
                startTime = Date.now();
                console.log("start timer");
            }
        }


        if(this.state.stage === INTERRUPTING && this.state.stage !== prevState.stage) {
            console.log("interrupted");
            const paperContainer = document.getElementById("paper_container");
            const videoContainer = document.getElementById("video_container");
            const videoPlayer = document.getElementById("video_player");
            const switchBtn = document.getElementById("switch_btn");

            videoPlayer.onended = () => {
                this.setState({
                    stage: PLAYING,
                });
            };

            switchBtn.onclick = () => {
                paperShown = !paperShown;
                paperContainer.style.display = (paperShown)? 'inline' : 'none';
                videoContainer.style.marginLeft = (paperShown)? "25px" : "0px";
                // subContainer.className = (paperShown)? "video_container" : "question_container";
                switchBtn.style.transform = (paperShown)? "none" : "scaleX(-1)";
            };
        }

        if(this.state.stage === PLAYING && this.state.stage !== prevState.stage) {
            console.log("playing");
            const paperContainer = document.getElementById("paper_container");
            const videoContainer = document.getElementById("video_container");
            const videoPlayer = document.getElementById("video_player");
            const switchBtn = document.getElementById("switch_btn");

            videoPlayer.onended = () => {
                this.setState({
                    stage: ANSWERING,
                });
            };

            switchBtn.onclick = () => {
                paperShown = !paperShown;
                paperContainer.style.display = (paperShown)? 'inline' : 'none';
                videoContainer.style.marginLeft = (paperShown)? "25px" : "0px";
                // subContainer.className = (paperShown)? "video_container" : "question_container";
                switchBtn.style.transform = (paperShown)? "none" : "scaleX(-1)";
            };
        }

        if(this.state.stage === ANSWERING && this.state.stage !== prevState.stage ) {
            if(this.state.part === PART_B) {
                const videoContainer = document.getElementById("video_container");
                videoContainer.style.marginLeft = "0px";

                const leftVideoPlayer = document.getElementById("left_video_player");
                leftVideoPlayer.onended = () => {
                    const a = document.createElement('a');
                    a.href = (this.state.part === PART_A)? "../../partB/introduction" : "../../report";
                    a.click();
                }

            }

            if(this.state.part === PART_A) {
                leftTime = answerTimePartA;

                const paperContainer = document.getElementById("paper_container");
                const videoContainer = document.getElementById("video_container");
                const switchBtn = document.getElementById("switch_btn");

                switchBtn.onclick = () => {
                    paperShown = !paperShown;
                    paperContainer.style.display = (paperShown)? 'inline' : 'none';
                    videoContainer.style.marginLeft = (paperShown)? "25px" : "0px";
                    // subContainer.className = (paperShown)? "video_container" : "question_container";
                    switchBtn.style.transform = (paperShown)? "none" : "scaleX(-1)";
                };
            }

            this.startRecordVideo();
        }
    }

    countDownOnce(){
        console.log("enter");
        // try {
        //     clearTimeout(mTimer);
        //     mTimer = null;
        // } catch(error) {
        //     console.log("error when clearing timer");
        //     console.log(error);
        // }

        mCount ++;
        var offset = Date.now() - (startTime + mCount * intervalTime);
        if(offset < 0) {
            offset = 0;
        }
        // console.log("offset", offset);
        
        var nextTime = intervalTime - offset;
        if (nextTime < 0) { 
            nextTime = 0 
        };
        leftTime -= intervalTime;
        
        const countdown = document.getElementById("countdown");
        var mins = parseInt(leftTime/(1000 * 60));
        var secs = parseInt((leftTime % (1000 * 60))/1000);
        mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
        secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();

        
        try{
            countdown.innerText = mins + ':' + secs;
            console.log(mins + ':' + secs);

            // console.log("Offset: " + offset + "ms, next count in " + nextTime + "ms, left prepare time" + leftTime + "ms");
            if(leftTime <= 0){
                console.log("countdown finishes!");
                try {
                    clearTimeout(mTimer);
                    mTimer = null;
                } catch(error) {
                    console.log("error when clearing timer");
                    console.log(error);
                }

                if(this.state.part === PART_A  && this.state.stage === PREPARING) {
                    this.setState({
                        stage: INTERRUPTING,
                        // stage: PLAYING,
                    });
                }
                else {
                    const finishBtn = document.getElementById('finish_btn');
                    finishBtn.className = "disable_button";
                    finishBtn.style.visibility = "visible";
                    this.stopRecordVideo();
                }

            }else{
                mTimer = setTimeout(this.countDownOnce, nextTime);
                // console.log("continue");
            }

        } catch(error){
            console.log(error);
        }

    }

    skipPrepare() {
        try {
            clearTimeout(mTimer);
            mTimer = null;
        } catch(error) {
            console.log("error when clearing timer");
            console.log(error);
        }

        this.setState({
            stage: PLAYING,
        });
    }

    startCamera() {
        console.log("start right");
        const rightVideoPlayer = document.getElementById('right_video_player');
        rightVideoPlayer.style.transform = "scaleX(-1)";

        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function (stream) {
                    mStream = stream;
                    rightVideoPlayer.srcObject = stream;})
                .catch(function (error) {
                    console.log(error)
                });
    }

    handleMediaStop() {
        if(this.state.stage === ANSWERING) {
            this.setState({
                waiting: true
            });
        }
        else {
            console.log(this.setState.stage);
        }

        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm'});

        videoChunks = [];
        audioChunks = [];

        const audioContext = new AudioContext();
        const reader = new FileReader();

        const part = this.state.part;
        const q_num = this.state.q_num;
        const q_type = this.state.q_type;
        
        const school = this.state.school;
        const name = this.state.name;

        // const removeWaitDialog = () => {
        //     this.setState({
        //         waiting: false,
        //     });
        // }

        const jumpToNextPage = () => {
            if(part === PART_A || leftTime > 0) {
            // if(this.state.part === PART_A) {
                const a = document.createElement('a');
                a.href = (part === PART_A)? "../../partB/introduction" : "../../report";
                // a.href = URL.createObjectURL(videoBlob);
                // a.download = "test.webm"
                a.click();
            }
            else {
                console.log("id B:", localStorage.getItem("id_B"));
                console.log("if id B is null or undefined, the dataset cannot receive data successfully");
            }
        }


        const handleDurationReady = async (duration) => {
            const formData = new FormData();
            formData.append('video', videoBlob);
            formData.append('audio', audioBlob);
            formData.append('duration', duration);
            formData.append('id', localStorage.getItem((part === PART_A)? "id_A":"id_B"));
            formData.append('part', part);
            formData.append('question_num', q_num);
            formData.append('question_type', q_type);
            formData.append('school', school);
            formData.append('name', name);

            console.log(localStorage.getItem((part === PART_A)? "id_A":"id_B"));


            // upload the formdata to the backend
            // replace '/upload_data' with 'http://{your_ip}:{your_port}/upload_data'
            await fetch(apiURL+'/upload_data', {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                localStorage.setItem((part === PART_A)? "upload_data_response_A" : "upload_data_response_B", JSON.stringify(data));
                console.log("Daily count: ", data[1]);
                localStorage.setItem((part === PART_A)? "daily_count_A" : "daily_count_B", data[1]);
                console.log('Send uploading data!');
                
                localStorage.setItem((part === PART_A)? "upload_data_error_A":"upload_data_error_B", "");
            })
            .catch(function(error) {
                localStorage.setItem((part === PART_A)? "upload_data_response_A" : "upload_data_response_B", "fail to get");
                localStorage.setItem((part === PART_A)? "daily_count_A" : "daily_count_B", "fail to get");
                localStorage.setItem((part === PART_A)? "upload_data_error_A":"upload_data_error_B", error);
                console.log('Fail to upload! ', error);
            });

            jumpToNextPage();
            // const videoUrl = URL.createObjectURL(videoBlob);
            // const audioUrl = URL.createObjectURL(audioBlob);

            // const a = document.createElement('a');
            // a.href = videoUrl;
            // a.download = "video.webm"
            // a.click();
            // URL.revokeObjectURL(videoUrl);

            // a.href = audioUrl;
            // a.download = "audio.wav"
            // a.click();
            // URL.revokeObjectURL(audioUrl);
        }

        reader.onload = function () {
            const buffer = reader.result;
            audioContext.decodeAudioData(buffer, function (audioBuffer) {
                const duration = audioBuffer.duration;
                console.log("duration");
                console.log(duration);
                handleDurationReady(duration);
            });
        };

        reader.readAsArrayBuffer(audioBlob);
    }

    startRecordVideo() {
        const videoPlayer = document.getElementById('video_player');
        videoPlayer.style.transform = "scaleX(-1)";

        const finishBtn = document.getElementById('finish_btn');

        videoPlayer.onplay = () => {
            finishBtn.className = "button";
            finishBtn.onclick = this.stopRecordVideo;
        }

        const onstopFunctionAudio = () => {
            if(!audioStopped) {
                try {                    
                    audioStopped = true;
                    if(videoStopped && audioStopped) {
                        this.handleMediaStop();
                        localStorage.setItem((debug_part === PART_A)? "audioStopped_error_A":"audioStopped_error_B", "no error");
                    }
                    else {
                        localStorage.setItem((debug_part === PART_A)? "audioStopped_error_A":"audioStopped_error_B", "wait for video to stop");
                    }
                }
                catch(error) {
                    localStorage.setItem((debug_part === PART_A)? "audioStopped_error_A":"audioStopped_error_B", error);
                    console.log(error);
                }
            }
        }

        const onstopFunctionVideo = () => {
            if(!videoStopped) {
                try{                    
                    videoStopped = true;
                    if(videoStopped && audioStopped) {
                        this.handleMediaStop();
                        localStorage.setItem((debug_part === PART_A)? "videoStopped_error_A":"videoStopped_error_B", "no error");
                    }
                    else {
                        localStorage.setItem((debug_part === PART_A)? "videoStopped_error_A":"videoStopped_error_B", "wait for audio to stop");
                    }
                }
                catch(error) {
                    localStorage.setItem((debug_part === PART_A)? "videoStopped_error_A":"videoStopped_error_B", error);
                    console.log(error);
                }
            }
        };

        
        const startTimer = () => {
            const countdown = document.getElementById("countdown");
            if(countdown && (mTimer === null)){ 
                var mins = parseInt(leftTime/(1000 * 60));
                var secs = parseInt((leftTime % (1000 * 60))/1000);
                mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
                secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
                try{
                    countdown.innerText = mins + ':' + secs;                    
                    console.log(mins + ':' + secs);
                } catch(error){
                    console.log(error);
                }

                mTimer = setTimeout(this.countDownOnce, intervalTime);
                startTime = Date.now();
                console.log("start timer");
            }
        }

        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function (stream) {
                    console.log("get");
                    mStream = stream;

                    const audioOptions = {
                        sampleSize: 16,  // 16-bit 采样大小
                        sampleRate: 16000,  // 16KHz 采样率
                        channelCount: 1  // 单声道（单声道为1，立体声为2）
                    };
                    const audioTrack = stream.getAudioTracks()[0];
                    audioTrack.applyConstraints(audioOptions);


                    const videoTrack = stream.getVideoTracks()[0];

                    videoRecorder = new MediaRecorder(new MediaStream([videoTrack]), { mimeType: 'video/webm; codecs=vp9' });
                    audioRecorder = new MediaRecorder(new MediaStream([audioTrack]), { mimeType: 'audio/webm' });

                    // videoRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
                    // audioRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });


                    videoRecorder.ondataavailable = (event) => {
                        videoChunks.push(event.data);
                    };

                    audioRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };


                    // mediaRecorder.ondataavailable = function (event) {
                    //     recordedChunks.push(event.data);
                    // };

                    videoRecorder.onstop = onstopFunctionVideo;
                    audioRecorder.onstop = onstopFunctionAudio;


                    videoPlayer.srcObject = mStream;
                    videoPlayer.play();


                    // videoRecorder.start();
                    // videoStopped = false;
                    try {
                        videoRecorder.start();
                        videoStopped = false;
                        console.log("video recording starts");                        
                        localStorage.setItem((debug_part === PART_A)? "videoStarted_error_A":"videoStarted_error_B", "no error");
                    } catch(errors) {
                        console.log("video recording fails");
                        console.log(errors);
                        videoStopped = true;
                        localStorage.setItem((debug_part === PART_A)? "videoStarted_error_A":"videoStarted_error_B", errors);
                    }

                    try {
                        audioRecorder.start();
                        audioStopped = false;
                        console.log("audio recording starts");                 
                        localStorage.setItem((debug_part === PART_A)? "audioStarted_error_A":"audioStarted_error_B", "no error");
                    } catch(errors) {
                        console.log("audio recording fails");
                        console.log(errors);
                        audioStopped = true;                 
                        localStorage.setItem((debug_part === PART_A)? "audioStarted_error_A":"audioStarted_error_B", errors);
                    }

                    console.log("debug_part here is ", debug_part);
                    
                    startTimer();    


                    })
                    .catch(function (error) {
                        console.error(error);
                    });
    }

    stopRecordVideo() {
        try {
            const finishBtn = document.getElementById('finish_btn');
            finishBtn.className = "disable_button";
        } catch(error) {
            console.log(error);
        }

        console.log("stop record once");
        try {
            mStream.getTracks().forEach((track) => track.stop());
            console.log("release");
        } catch(error) {
            console.log("errors when releasing tracks");
            console.log(error);
        }
        if (videoRecorder && videoRecorder.state !== 'inactive') {
            videoRecorder.stop();
        }

        if (audioRecorder && audioRecorder.state !== 'inactive') {
            audioRecorder.stop();
        }
    }


    render() {
        var mPart = (this.state.part === PART_A)? "Part A" : "Part B";
        var mQuestionArea = (this.state.part === PART_A)?
            (
                <div className="question_area">
                    <p className="source">{this.state.text["source"]}</p>
                    <p className="title">{this.state.text["title"]}</p>
                    <p className="content">{this.state.text["content"]}</p>
                    <ul>
                        {this.state.text["partA"].map(item => <li key={item.id} className="partA_questions">{item.text}</li>)}
                    </ul>
                </div>
            ) :
            (
                <div className="question_area">
                    <p className="partB_question">{this.state.text["partB"][parseInt(Math.random()*this.state.text["partB"].length)]["text"]}</p>
                </div>
            );

        var mHeading;
        var mBoard;

        switch(this.state.stage) {
            case OPENING:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        <p className="guide">Please listen to the examiner:</p>
                    </div>
                );

                mBoard = (
                    <div className="board">
                        <div className="question_subcontainer">
                            <video id="video_player" src={
                                require("../video/examiner_videos/Examiner_PartA_opening.mp4")
                            } autoPlay></video>
                        </div>
                    </div>
                );
                break;


            case PREPARING:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        <p className="guide">You have 10 mins to read the article and questions and prepare.</p>
                        {mQuestionArea}
                    </div>
                );

                mBoard = (
                    <div className="board">
                        <div className="btn_div">
                            <button className="button" onClick={this.skipPrepare}>
                                <span id="countdown"></span><span className="label">skip</span>
                            </button>
                        </div>
                    </div>
                );
                break;

            case INTERRUPTING:
            case PLAYING:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        {(this.state.part === PART_A) &&
                            <div id="switch_btn">
                                {mSVG}
                                {/* {(paperShown)? "hide" : "view"} */}
                            </div>}
                    </div>
                );

                mBoard = (
                    <div className="board">
                        <div className="main_container">
                            <div id="paper_container">
                                {mQuestionArea}
                            </div>
                            <div id="video_container">
                                <p className="guide">You will listen to the 1st discussant's response:</p>
                                <div className="video_subcontainer" id="subcontainer">
                                    <video id="video_player" src={(this.state.stage === INTERRUPTING)?
                                        require("../video/examiner_videos/Examiner_PartA_ending.mp4") :
                                        require('../video/candidate_videos/Candidate_Q'+ this.state.q_num.toString() +'_'+ ((parseInt(this.state.q_type)===WEAK)? 'Weak':'Strong') +'.mp4')
                                    } autoPlay>
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                break;

            case QUESTIONING:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        <p className="guide">After listening to the question, you will have 1 min to answer.</p>
                    </div>
                );

                mBoard = (
                    <div className="board">
                        <div className="main_container">
                            <div id="left_video_container">
                                <p className="guide">Examiner:</p>
                                <div className="video_subcontainer">
                                    <video id="left_video_player" src={
                                        require('../video/question_videos/Examiner_Q'+ this.state.q_num.toString() +'_'+ ((parseInt(this.state.q_type)===WEAK)? 'Weak':'Strong') +'.mp4')
                                    } autoPlay></video>
                                </div>
                            </div>
                            <div id="right_video_container">
                                <p className="guide">Please listen to the question:</p>
                                <div className="video_subcontainer">
                                    <video id="right_video_player" autoPlay muted playsInline></video>
                                </div>
                            </div>
                        </div>

                        {/* <div className="question_subcontainer">
                            <video id="video_player" src="https://upos-hz-mirrorakam.akamaized.net/upgcxcode/16/19/1392991916/1392991916-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1704723640&gen=playurlv2&os=akam&oi=804486655&trid=e0a9bee4159a421eb404d51539881341h&mid=0&platform=html5&upsig=6ee250ee3ea8c16ef5484be8e8004ff6&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&hdnts=exp=1704723640~hmac=3cdfef4deb6ceb7c86de6577ff09e9d618c1758f540d2655746011af1a46c619&bvc=vod&nettype=0&f=h_0_0&bw=50731&logo=80000000" autoPlay></video>
                        </div> */}
                    </div>
                );
                break;

            case ANSWERING:
            default:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        {(this.state.part === PART_A) &&
                            <div id="switch_btn">
                                {mSVG}
                                {/* {(paperShown)? "hide" : "view"} */}
                            </div>}
                        {/* {(this.state.part === PART_B) && */}
                        <p className="guide">Please click the timer below your video when you finish and would like to move on.</p>
                    </div>
                );

                mBoard = (this.state.part === PART_A)?
                (
                    <div className="board">
                        <div className="main_container">
                            {(this.state.part === PART_A) && <div id="paper_container">
                                {mQuestionArea}
                            </div>}
                            <div id="video_container">
                                <p className="guide">Now it is your turn to speak:</p>
                                <div className="camera_subcontainer">
                                    <video id="video_player" muted></video>
                                </div>
                                <div className="button_container">
                                    {/* {(this.state.part === PART_A) &&
                                    <button className="disable_button" id="finish_btn">finish</button>}

                                    {(this.state.part === PART_B) && */}
                                    <button className="disable_button" id="finish_btn">
                                        <span id="countdown"></span><span className="label">finish</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                (
                    <div className="board">
                        <div className="main_container">
                            <div id="left_video_container">
                                <p className="guide">Examiner:</p>
                                <div className="video_subcontainer">
                                    <video id="left_video_player" src={
                                        require("../video/examiner_videos/Examiner_PartB.mp4")
                                    } autoPlay></video>
                                </div>
                            </div>
                            <div id="video_container">
                                <p className="guide">Please give your answer:</p>
                                <div className="camera_subcontainer">
                                    <video id="video_player" autoPlay muted playsInline></video>
                                </div>
                                <div className="button_container">
                                    {/* {(this.state.part === PART_A) &&
                                    <button className="disable_button" id="finish_btn">finish</button>}

                                    {(this.state.part === PART_B) && */}
                                    <button className="disable_button" id="finish_btn">
                                        <span id="countdown"></span><span className="label">finish</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

        }

        return(
            <div className="main">
                { this.state.waiting && <WaitDialog text={"Uploading your data ... Please do NOT refresh or leave this page."}></WaitDialog> }
                {mHeading}
                {mBoard}
            </div>
        );
    }
}

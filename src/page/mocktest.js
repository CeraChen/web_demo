import React from "react";
import questions from '../text/questions.json';
import '../css/mocktest.css';
import '../css/button.css';
import mQuestionVideo_B from "../video/DSE_Examiner_video_3.mp4";
import mQuestionVideo_A from "../video/DSE_Examiner_video_2.mp4"
import mStarterVideo from "../video/DSE_Student_video_1.mp4";



const PART_A = 0;
const PART_B = 1;

const PREPARING = 0;
const PLAYING = 1;
const QUESTIONING = 2;
const ANSWERING = 3;

const intervalTime = 1000;
const prepareTime = 1000 * 60 * 10;
const answerTimePartB = 1000 * 60;
const answerTimePartA = 1000 * 60 * 2;

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


export default class MockTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: props.part,
            q_num: props.q_num,
            text: questions.question_text["q" + props.q_num.toString()],
            stage: (props.part === PART_A)? PREPARING : QUESTIONING,
            // exit_confirmed: false,
        };
        this.render = this.render.bind(this);
        this.countDownOnce = this.countDownOnce.bind(this);
        this.skipPrepare = this.skipPrepare.bind(this);
        this.startRecordVideo = this.startRecordVideo.bind(this);
        this.handleMediaStop = this.handleMediaStop.bind(this);


        leftTime = (props.part === PART_A)? prepareTime : answerTimePartB;
        mCount = 0;
    }

    // handleBeforeUnload = (event) => {
    //     if (this.state.exit_confirmed) {
    //         event.preventDefault();
    //         event.returnValue = '';
        
    //         const confirmationMessage = '您是否确定要离开此页面？您的数据可能不会保存。';
    //         return confirmationMessage;
    //     }
    // }
    
    // handleExitClick = () => {
    //     this.setState({ exit_confirmed: true });
    // }
    
    // handleStayClick = () => {
    //     this.setState({ exit_confirmed: false });
    // }


    componentDidMount() {
        // window.addEventListener('beforeunload', this.handleBeforeUnload);

        if(this.state.stage === PREPARING) {
            console.log("did mount...");
            var countdown = document.getElementById("countdown");
            if(countdown && (mTimer === null)){ 
                var mins = parseInt(leftTime/(1000 * 60));
                var secs = parseInt((leftTime % (1000 * 60))/1000);
                mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
                secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
                try{
                    countdown.innerText = mins + ':' + secs;
                } catch(error){
                    console.log(error);
                }

                mTimer = setTimeout(this.countDownOnce, intervalTime);
                startTime = Date.now();
                console.log("start timer");
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
        if(this.state.stage === PLAYING && this.state.stage !== prevState.stage) {
            console.log("playing");
            const paperContainer = document.getElementById("paper_container");
            const videoContainer = document.getElementById("video_container");
            const subContainer = document.getElementById("subcontainer");
            const videoPlayer = document.getElementById("video_player");
            const switchBtn = document.getElementById("switch_btn");

            videoPlayer.onended = () => {
                this.setState({
                    stage: ANSWERING,
                });
            };

            switchBtn.addEventListener('click', (event) => {
                paperShown = !paperShown;
                paperContainer.style.display = (paperShown)? 'inline' : 'none';
                videoContainer.style.marginLeft = (paperShown)? "25px" : "0px";
                // subContainer.className = (paperShown)? "video_container" : "question_container";
                switchBtn.style.transform = (paperShown)? "none" : "scaleX(-1)";
            });
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
            }

            const countdown = document.getElementById("countdown");
            if(countdown && (mTimer === null)){ 
                var mins = parseInt(leftTime/(1000 * 60));
                var secs = parseInt((leftTime % (1000 * 60))/1000);
                mins = (mins < 10)? ('0' + mins.toString()) : mins.toString();
                secs = (secs < 10)? ('0' + secs.toString()) : secs.toString();
                try{
                    countdown.innerText = mins + ':' + secs;
                } catch(error){
                    console.log(error);
                }

                mTimer = setTimeout(this.countDownOnce, intervalTime);
                startTime = Date.now();
                console.log("start timer");
            }


            this.startRecordVideo();
        }
    }
    
    countDownOnce(){
        console.log("enter");
        try {
            clearTimeout(mTimer);
            mTimer = null;
        } catch(error) {
            console.log("error when clearing timer");
            console.log(error);
        }

        mCount ++;
        var offset = Date.now() - (startTime + mCount * intervalTime);
        
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

            console.log("Offset: " + offset + "ms, next count in " + nextTime + "ms, left prepare time" + leftTime + "ms");
            if(leftTime <= 0){
                console.log("countdown finishes!");
                mTimer = null;

                if(this.state.part === PART_A  && this.state.stage === PREPARING) {
                    this.setState({
                        // stage: PLAYING,
                        stage: ANSWERING,
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
                console.log("continue");
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
            // stage: PLAYING,
            stage: ANSWERING,
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
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav'});
        
        const formData = new FormData();
        formData.append('video', videoBlob);
        formData.append('audio', audioBlob);
        formData.append('id', localStorage.getItem((this.state.part === PART_A)? "id_A":"id_B"));
        formData.append('part', this.state.part);
        console.log(localStorage.getItem((this.state.part === PART_A)? "id_A":"id_B"));


        // upload the formdata to the backend
        // replace '/upload_data' with 'http://{your_ip}:{your_port}/upload_data' 
        fetch('/upload_data', {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            console.log('Send uplaoding data!');
        })
        .catch(function(error) {
            console.log('Fail to upload! ', error);
        });

        videoChunks = [];
        audioChunks = [];
        
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
            
        // if(this.state.part === PART_A || leftTime > 0) {
        if(this.state.part === PART_A) {
            const a = document.createElement('a');
            a.href = (this.state.part === PART_A)? "../../partB/introduction" : "../../report";
            // url;
            // a.download = "video.webm"
            a.click();
        }
        else {
            console.log("id B:", localStorage.getItem("id_B"));
        }

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
                audioStopped = true;
                if(videoStopped && audioStopped) {
                    this.handleMediaStop();
                }
            }
        }
        
        const onstopFunctionVideo = () => {   
            if(!videoStopped) {                
                videoStopped = true;
                if(videoStopped && audioStopped) {
                    this.handleMediaStop();
                }
            }
        };


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

                    
                    // mediaRecorder = new MediaRecorder(stream);
                    
                    videoRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
                    audioRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });


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
                        

                    videoRecorder.start();
                    videoStopped = false;
                    
                    try {
                        audioRecorder.start();
                        audioStopped = false;
                    } catch(errors) {
                        console.log(errors);
                        audioStopped = true;
                    }
                    
                    
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
    }

    stopRecordVideo() {
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
            case PREPARING:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        <p className="guide">You will have 10 mins to read the article and questions and prepare.</p>
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
                                <p className="guide">You can listen to the 1st discussant's response:</p>
                                <div className="video_subcontainer" id="subcontainer">
                                    <video id="video_player" src={mStarterVideo} autoPlay></video>
                                    {/* "https://rr4---sn-i3b7knzl.googlevideo.com/videoplayback?expire=1703949630&ei=3uCPZf6jI-GcvcAP7KeFwAo&ip=43.129.29.153&id=o-AAFXlTtNe8dMwECQKEk4wSxKlXlS_jIyGdj7hkFYVFd0&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=yB&mm=31%2C26&mn=sn-i3b7knzl%2Csn-un57sn7y&ms=au%2Conr&mv=u&mvi=4&pl=21&spc=UWF9f6u0q2pfRW-4Rk1-WMveD8QFvEQ&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=48.018&lmt=1672869798672213&mt=1703927117&fvip=2&fexp=24007246&c=ANDROID&txp=6219224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgD-Klh0sH8kS7TyxJRZyjWRH9xQdygMcc8cjGQl6b2pICIHnL-3EsNuxGRE5dEz8TzChTs6eFDFXb3qKcwIGPcY4M&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AAO5W4owRAIgV7ZX8trF4sEkJl3pyBTyD0z_r55GUMZSxtvZyxqgefsCIGfJ5edyYTNALjFtW_KDLoAjrYGaPvSpWKZZEcXt3Gjx" autoPlay></video> */}
                                    {/* "https://rr4---sn-i3b7knld.googlevideo.com/videoplayback?expire=1703942923&ei=q8aPZbzzOoGa1d8PzsawMA&ip=43.129.29.153&id=o-ALxqmNCnTAT36RnxDFI-D7pUJIUTOGm51vjCOA46-b7i&itag=136&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=I0&mm=31%2C29&mn=sn-i3b7knld%2Csn-i3belnlz&ms=au%2Crdu&mv=m&mvi=4&pl=21&initcwndbps=623750&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=12345656&dur=237.070&lmt=1703028113368785&mt=1703920860&fvip=2&keepalive=yes&fexp=24007246&c=IOS&txp=4535434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAMrBZ6GVs4QRHCEp0-OK69jfliPlt_4cYZ2ZHC-j_9UIAiEA7zM9lUYBx_YmZGQ78RMitbacPdP4wvSxuum_qBZ55Vg%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIhAPEH6osM_v-0UoE9KXvSbPX134lBOX5zoNQZxrw6YHvbAiAgS38KCuAeLXcNBRMpJ8XjLz89ZiZIFNQFdZDvLiOf6g%3D%3D" autoPlay></video> */}
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
                                    <video id="left_video_player" src={mQuestionVideo_A} autoPlay></video>
                                </div> 
                            </div>
                            <div id="right_video_container">
                                <p className="guide">You:</p>
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
                                    <video id="left_video_player" src={mQuestionVideo_B} autoPlay></video>
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
                {mHeading}
                {mBoard}
            </div>

            // <div onClick={this.updateUrl(this.state.part, "hihi")}>
            //     <Link to={nextPage}>Intro counting down</Link>
            // </div>
        );
    }
}
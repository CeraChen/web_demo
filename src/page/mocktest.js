import React from "react";
import questions from '../text/questions.json';
import '../css/mocktest.css';
import '../css/button.css';


const PART_A = 0;
const PART_B = 1;

const PREPARING = 0;
const PLAYING = 1;
const QUESTIONING = 2;
const ANSWERING = 3;

const intervalTime = 1000;
const prepareTime = 1000 * 60 * 10;
const answerTime = 1000 * 60;
const mSVG = <svg t="1703230099825" className="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4207" width="27" height="30"><path d="M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z" p-id="4208"></path></svg>;

let mTimer = null;
let mCount, startTime, leftTime;
// let isDragging = false;
let paperShown = true;
let mStream = null;

let mediaRecorder; // 用于存储 MediaRecorder 对象
let recordedChunks = []; // 存储录制的视频块
let mURL = null;


export default class MockTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: props.part,
            q_num: props.q_num,
            text: questions.question_text["q" + props.q_num.toString()],
            stage: (props.part === PART_A)? PREPARING : QUESTIONING,
        };
        this.render = this.render.bind(this);
        this.countDownOnce = this.countDownOnce.bind(this);
        this.skipPrepare = this.skipPrepare.bind(this);
        this.startRecordVideo = this.startRecordVideo.bind(this);


        leftTime = (props.part === PART_A)? prepareTime : answerTime;
        mCount = 0;
    }


    componentDidMount() {
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
            const videoPlayer = document.getElementById("video_player");

            videoPlayer.onended = () => {
                if (mStream) {
                    mStream.getTracks().forEach((track) => track.stop());
                    console.log("release");
                }

                this.setState({
                    stage: ANSWERING,
                });
            };

            // this.startCamera();
        }
    }

    componentWillUnmount() {
        //弹窗阻止退出

        if(mTimer !== null) {
            clearTimeout(mTimer);
            mTimer = null;
        }

        this.stopRecordVideo();
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

            }
            this.startRecordVideo();
        }
    }
    
    countDownOnce(){
        console.log("enter");
        clearTimeout(mTimer);

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

                if(this.state.part === PART_A) {
                    this.setState({
                        stage: PLAYING,
                    });
                }
                else {
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
        if(mTimer !== null) {
            clearTimeout(mTimer);
            mTimer = null;
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

    startRecordVideo() {
        const videoPlayer = document.getElementById('video_player');
        videoPlayer.style.transform = "scaleX(-1)";

        const finishBtn = document.getElementById('finish_btn');
        videoPlayer.onplay = () => {  
            finishBtn.className = "button";
            finishBtn.onclick = this.stopRecordVideo;
        }
        
        const onstopFunction = () => {                
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            mURL = url;
            console.log("update url");
            console.log(url.blob);
            console.log(mURL.toString());
            
            localStorage.setItem((this.state.part === PART_A)? 'partAUrl' : 'partBUrl', mURL);
            
            recordedChunks = [];
    
            const a = document.createElement('a');
            a.href = (this.state.part === PART_A)? "../../partB/introduction" : "../../report";
            a.click();
        };


        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function (stream) {
                    console.log("get");
                    mStream = stream;

                    mediaRecorder = new MediaRecorder(stream);

                    mediaRecorder.ondataavailable = function (event) {
                        recordedChunks.push(event.data);
                    };

                    mediaRecorder.onstop = onstopFunction;

                    mediaRecorder.start();

                    
                    videoPlayer.srcObject = mStream;
                    videoPlayer.play();
                    })
                    .catch(function (error) {
                    console.error('Error accessing camera:', error);
                    });
    }

    stopRecordVideo() {
        console.log("stop record once");
        if (mStream) {            
            mStream.getTracks().forEach((track) => track.stop());
            console.log("release");
        }
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
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
                                <p className="guide">Starter video:</p>
                                <div className="video_subcontainer" id="subcontainer">
                                    <video id="video_player" src="https://rr3---sn-i3belney.googlevideo.com/videoplayback?expire=1704385551&ei=r4eWZePXD5KM0-kP65SsoAM&ip=43.129.69.57&id=o-AGIqdKu9moRjTictpABShCaMcMRd1_3O_kTfwcPc9kJq&itag=243&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Vq&mm=31%2C29&mn=sn-i3belney%2Csn-i3b7knzs&ms=au%2Crdu&mv=m&mvi=3&pl=19&initcwndbps=1035000&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=304587&dur=12.666&lmt=1704290657428042&mt=1704362696&fvip=3&keepalive=yes&fexp=24007246&c=IOS&txp=5537434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgc49sQt726jNBvVAiO2WWyiOoyA8iE-rwpRjrEsqlAFUCIDjZDDyqQygT03pYwb9dd0tl3ZGPX3dWprwDR5U3durv&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIhALGeyxHDFb5qNV1Yzybms1PBoBx41S3G_W_JU5CHMoZ7AiBPjKG1Zoi2vNX_213zZGzgBX9JdVNxOu3AwkUO9_Zn8A%3D%3D" autoPlay></video>
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
                        {/* <div className="main_container">
                            <div id="left_video_container">
                                <p className="guide">Starter video:</p>
                                <div className="video_subcontainer">
                                    <video id="left_video_player" src="https://rr3---sn-i3belney.googlevideo.com/videoplayback?expire=1704385551&ei=r4eWZePXD5KM0-kP65SsoAM&ip=43.129.69.57&id=o-AGIqdKu9moRjTictpABShCaMcMRd1_3O_kTfwcPc9kJq&itag=243&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Vq&mm=31%2C29&mn=sn-i3belney%2Csn-i3b7knzs&ms=au%2Crdu&mv=m&mvi=3&pl=19&initcwndbps=1035000&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=304587&dur=12.666&lmt=1704290657428042&mt=1704362696&fvip=3&keepalive=yes&fexp=24007246&c=IOS&txp=5537434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgc49sQt726jNBvVAiO2WWyiOoyA8iE-rwpRjrEsqlAFUCIDjZDDyqQygT03pYwb9dd0tl3ZGPX3dWprwDR5U3durv&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIhALGeyxHDFb5qNV1Yzybms1PBoBx41S3G_W_JU5CHMoZ7AiBPjKG1Zoi2vNX_213zZGzgBX9JdVNxOu3AwkUO9_Zn8A%3D%3D" autoPlay></video>
                                </div> 
                            </div>
                            <div id="right_video_container">
                                <p className="guide">Starter video:</p>
                                <div className="video_subcontainer">
                                    <video id="right_video_player" autoPlay muted playsInline></video>
                                </div> 
                            </div>
                        </div> */}

                        <div className="question_subcontainer">
                            <video id="video_player" src="https://rr3---sn-i3belney.googlevideo.com/videoplayback?expire=1704385551&ei=r4eWZePXD5KM0-kP65SsoAM&ip=43.129.69.57&id=o-AGIqdKu9moRjTictpABShCaMcMRd1_3O_kTfwcPc9kJq&itag=243&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Vq&mm=31%2C29&mn=sn-i3belney%2Csn-i3b7knzs&ms=au%2Crdu&mv=m&mvi=3&pl=19&initcwndbps=1035000&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=304587&dur=12.666&lmt=1704290657428042&mt=1704362696&fvip=3&keepalive=yes&fexp=24007246&c=IOS&txp=5537434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgc49sQt726jNBvVAiO2WWyiOoyA8iE-rwpRjrEsqlAFUCIDjZDDyqQygT03pYwb9dd0tl3ZGPX3dWprwDR5U3durv&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIhALGeyxHDFb5qNV1Yzybms1PBoBx41S3G_W_JU5CHMoZ7AiBPjKG1Zoi2vNX_213zZGzgBX9JdVNxOu3AwkUO9_Zn8A%3D%3D" autoPlay></video>
                        </div>
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
                
                mBoard =(
                    <div className="board">
                        <div className="main_container">
                            {(this.state.part === PART_A) && <div id="paper_container">
                                {mQuestionArea}
                            </div>}
                            <div id="video_container">
                                <p className="guide">Now it is your turn:</p>
                                <div className="camera_subcontainer">
                                    <video id="video_player" ></video>
                                </div>                                
                                <div className="button_container">
                                    {(this.state.part === PART_A) &&
                                    <button className="disable_button" id="finish_btn">finish</button>}

                                    {(this.state.part === PART_B) &&
                                    <button className="disable_button" id="finish_btn">
                                        <span id="countdown"></span><span className="label">finish</span>
                                    </button>}
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
import React from "react";
import { Link } from "react-router-dom";
import questions from '../text/questions.json';
import '../css/mocktest.css';
import '../css/button.css';


const PART_A = 0;
const PART_B = 1;

const PREPARING = 0;
const PLAYING = 1;
const ANSWERING = 2;

const intervalTime = 1000;
const prepareTime = 1000 * 60 * 10;
const mSVG = <svg t="1703230099825" className="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4207" width="30" height="40"><path d="M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z" p-id="4208"></path></svg>;

let mTimer = null;
let mCount, startTime, leftTime;
// let isDragging = false;
let paperShown = true;


export default class MockTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: props.part,
            q_num: props.q_num,
            text: questions.question_text["q" + props.q_num.toString()],
            stage: (props.part === PART_A)? PREPARING : ANSWERING,
        };
        this.render = this.render.bind(this);
        this.countDownOnce = this.countDownOnce.bind(this);
        this.skipPrepare = this.skipPrepare.bind(this);

        this.updateUrl = (part, newUrl) => props.update_url(part, newUrl);

        leftTime = prepareTime;
        mCount = 0;
    }


    componentDidMount() {
        if(this.state.stage === PREPARING) {
            console.log("did mount...");
            var countdown = document.getElementById("countdown");
            if(countdown && (mTimer === null)){ 
                // countdown.style.display = "inline";
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
    }

    componentWillUnmount() {
        //弹窗阻止退出

        if(mTimer !== null) {
            clearTimeout(mTimer);
            mTimer = null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.stage === PLAYING && this.state.stage !== prevState.stage) {
            console.log("playing");
            // const separator = document.getElementById("separator");
            const paperContainer = document.getElementById("paper_container");
            const videoContainer = document.getElementById("video_container");
            const switchBtn = document.getElementById("switch_btn");


            switchBtn.addEventListener('click', (event) => {
                paperShown = !paperShown;
                paperContainer.style.display = (paperShown)? 'inline' : 'none';
                switchBtn.style.transform = (paperShown)? "none" : "scaleX(-1)";
                // switchBtn.innerText = (paperShown)? "hide" : "view";
                // isDragging = true;
                // console.log("mouse down");
                // document.body.style.userSelect = 'none';
            });

            // document.addEventListener('mousemove', (event) => {
            //     if (!isDragging) return;
                
            //     const x = event.clientX;
            //     const containerWidth = document.documentElement.clientWidth;
            //     const separatorWidth = separator.offsetWidth;
                
            //     const paperContainerWidth = (x / containerWidth) * 100;
            //     const videoContainerWidth = 100 - paperContainerWidth;
                
            //     paperContainer.style.width = `${paperContainerWidth}%`;
            //     videoContainer.style.width = `${videoContainerWidth}%`;

            //     console.log("mouse move");
            // });

            // document.addEventListener('mouseup', () => {
            //     isDragging = false;
            //     console.log("mouse up");
            //     document.body.style.userSelect = 'auto';

            //     paperContainer.style.display = 'inline';
            // });
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
        
        var countdown = document.getElementById("countdown");
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
                this.setState({
                    stage: PLAYING,
                });

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


    render() {
        var mPart = (this.state.part === PART_A)? "Part A" : "Part B";
        var mGuide = (this.state.part === PART_A)? "Now you have 2 mins to answer." : "Now you have 1 min to answer."
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
                            {/* <div id="separator">
                                <div className="indicator">
                                    <svg t="1703230099825" className="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4207" width="200" height="200"><path d="M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z" p-id="4208"></path></svg>
                                </div>
                            </div> */}
                            <div id="video_container">
                                <p className="guide">Starter video:</p>
                                {/* <video className="starter_video"></video> */}
                                <div className="video_subcontainer">
                                    <video id="video_player" src="https://rr4---sn-i3b7knld.googlevideo.com/videoplayback?expire=1703942923&ei=q8aPZbzzOoGa1d8PzsawMA&ip=43.129.29.153&id=o-ALxqmNCnTAT36RnxDFI-D7pUJIUTOGm51vjCOA46-b7i&itag=136&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=I0&mm=31%2C29&mn=sn-i3b7knld%2Csn-i3belnlz&ms=au%2Crdu&mv=m&mvi=4&pl=21&initcwndbps=623750&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=12345656&dur=237.070&lmt=1703028113368785&mt=1703920860&fvip=2&keepalive=yes&fexp=24007246&c=IOS&txp=4535434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAMrBZ6GVs4QRHCEp0-OK69jfliPlt_4cYZ2ZHC-j_9UIAiEA7zM9lUYBx_YmZGQ78RMitbacPdP4wvSxuum_qBZ55Vg%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIhAPEH6osM_v-0UoE9KXvSbPX134lBOX5zoNQZxrw6YHvbAiAgS38KCuAeLXcNBRMpJ8XjLz89ZiZIFNQFdZDvLiOf6g%3D%3D" autoPlay></video>
                                </div>
                                {/* https://video-ssl.itunes.apple.com/itunes-assets/Video124/v4/15/e2/80/15e280e2-7d82-6b9b-2cb1-90df023eaa29/mzvf_10142644751851384725.720w.h264lc.U.p.m4v" autoPlay></video> */}
                            </div>
                        </div>
                    </div>
                )
                break;
            
            case ANSWERING:
            default:
                mHeading = (
                    <div className="heading">
                        <p className="part">{mPart}</p>
                        <p className="guide">{mGuide}</p>
                        {mQuestionArea}
                    </div>
                );

        }



        // const nextPage = (this.state.part === PART_A)? "../../partB/introduction" : "../../report";
       
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
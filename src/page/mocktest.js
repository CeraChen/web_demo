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

let mTimer = null;
let mCount, startTime, leftTime;
let isDragging = false;


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
            const separator = document.getElementById("separator");
            const paperContainer = document.getElementById("paper_container");
            const videoContainer = document.getElementById("video_container");


            separator.addEventListener('mousedown', (event) => {
                isDragging = true;
                console.log("mouse down");
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (event) => {
                if (!isDragging) return;
                
                const x = event.clientX;
                const containerWidth = document.documentElement.clientWidth;
                const separatorWidth = separator.offsetWidth;
                
                const paperContainerWidth = (x / containerWidth) * 100;
                // const videoContainerWidth = 100 - paperContainerWidth;
                
                paperContainer.style.width = `${paperContainerWidth}%`;
                // videoContainer.style.width = `${videoContainerWidth}%`;

                console.log("mouse move");
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                console.log("mouse up");
                document.body.style.userSelect = 'auto';
            });
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
                    </div>
                );

                mBoard = (
                    <div className="board">
                        <div className="main_container">
                            <div id="paper_container">
                                {mQuestionArea}
                            </div>
                            <div id="separator">
                                <div className="indicator">
                                    {/* <svg t="1703231389075" class="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8594" width="800" height="800"><path d="M664 832c10.752 0 20.096-3.968 28.096-11.904C700.096 812.096 704 802.752 704 792l0-560c0-10.816-3.904-20.16-11.904-28.096C684.096 195.904 674.752 192 664 192s-20.096 3.904-28.096 11.904L355.904 483.904C348.032 491.84 344 501.184 344 512c0 10.752 3.968 20.096 11.904 28.096l280 280C643.904 828.032 653.248 832 664 832z" p-id="8595"></path></svg> */}
                                    <svg t="1703230099825" className="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4207" width="200" height="200"><path d="M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z" p-id="4208"></path></svg>
                                    {/* <svg t="1703230158772" class="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4585" width="200" height="200"><path d="M512 2.373117C230.785632 2.373117 2.966396 230.192352 2.966396 511.406721S230.785632 1020.440324 512 1020.440324s509.033604-227.819235 509.033604-509.033603S793.214368 2.373117 512 2.373117z m186.289687 719.054461c15.425261 15.425261 15.425261 40.34299 0 55.768251L622.349942 853.135574a39.393743 39.393743 0 0 1-55.76825 0L331.643105 619.383546c-1.186559-1.186559-2.373117-1.186559-2.373117-2.373117l-77.126303-77.126304c-3.559676-3.559676-7.119351-8.30591-8.30591-13.052144-5.932793-14.238702-3.559676-32.03708 8.30591-42.716106l77.126303-77.126304c1.186559-1.186559 3.559676-3.559676 5.932793-4.746234l232.565469-232.565469c15.425261-15.425261 40.34299-15.425261 55.768251 0l77.126303 77.126303c15.425261 15.425261 15.425261 40.34299 0 55.768251L489.455388 511.406721l208.834299 210.020857z" p-id="4586"></path></svg> */}
                                    {/* <svg t="1703230581648" class="indicate_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4877" width="200" height="200"><path d="M210.4 511.1 641.3 80.2c22.8-22.8 59.8-22.8 82.6 0 22.8 22.8 22.8 59.8 0 82.6L375.7 511.1l348.3 348.3c22.8 22.8 22.8 59.8 0 82.6-22.8 22.8-59.8 22.8-82.6 0L210.4 511.1 210.4 511.1zM210.4 511.1" p-id="4878"></path></svg> */}
                                </div>
                            </div>
                            <div id="video_container">
                                <p className="guide">Starter video:</p>
                                <video className="starter_video"></video>
                                {/* <video src="https://video-ssl.itunes.apple.com/itunes-assets/Video124/v4/15/e2/80/15e280e2-7d82-6b9b-2cb1-90df023eaa29/mzvf_10142644751851384725.720w.h264lc.U.p.m4v" autoPlay></video> */}
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
import React from "react"
import {Link} from "react-router-dom"
import '../css/entry.css'
import mIcon from './earth-removebg-preview.png'
import homeIcon from '../icon/home-fill.png'
import accountIcon from '../icon/account.png'
import historyIcon from '../icon/history-filling.png'
import settingIcon from '../icon/settings-fill.png'
import speechIcon from '../icon/speech.png'
import speakIcon from '../icon/speaker-flipped.png'
import USTlogo from '../icon/UST.svg'


export default class EntryPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            // part: props.part,
        };
        this.render = this.render.bind(this);
    }

    render() {
        return (
            <div className="whole_page">
                <div className="head">
                    <img id="project_icon" src={mIcon} alt="icon"/> 
                    <span className="project_title">SpeechAIlab</span>
                </div>
                <div className="side_navigation">
                    <div className="navi_item">
                        <img className="navi_icon" src={homeIcon} alt="home"></img>
                        <span className="navi_text">Home</span>
                    </div>
                    
                    <div className="navi_item">
                        <img className="navi_icon" src={accountIcon} alt="account"></img>
                        <span className="navi_text">Account</span>
                    </div>

                    <div className="navi_item">
                        <img className="navi_icon" src={historyIcon} alt="history"></img>
                        <span className="navi_text">History</span>
                    </div>

                    <div className="navi_item">
                        <img className="navi_icon" src={settingIcon} alt="setting"></img>
                        <span className="navi_text">Setting</span>
                    </div>
                </div>
                <div className="sub_entry">
                    <div className="module_title">
                        <img className="module_icon" src={speechIcon} alt="speech"></img>
                        <span className="module_text">HKDSE Paper 4 - mock test</span>
                    </div>

                    <Link to="/mocktest/A" style={{ textDecoration:'none', color: 'black'}}>
                        <button className="mocktest">
                            Part A - Group Discussion
                        </button>
                    </Link>
                    <Link to="/mocktest/B" style={{ textDecoration:'none', color: 'black'}}>
                        <button className="mocktest">
                            Part B - Individual Response
                        </button>
                    </Link>
                </div>

                {/* <div className="sub_entry" id="module_practice">
                    <div className="module_title">
                        <img className="module_icon" id="speaker_icon" src={speakIcon} alt="speak"></img>
                        <span className="module_text">Script reading - practice</span>
                    </div>
                    
                    <div className="practice" id="word">
                        Words
                    </div>
                    <div className="practice" id="sentence">
                        Sentences
                    </div>
                </div> */}

                <div className="logo">
                    <img className="ust_logo" src={USTlogo} alt="ust"></img>
                    <span className="ust_text">powered by HKUST</span>
                </div>
            </div>
        );
    }
}

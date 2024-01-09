import React from "react";
import {Link} from "react-router-dom";
import mVideo from "../video/DSE_Student_video_1.mp4"


export default class StartPage extends React.Component{
    componentDidMount() {
        // const videoPlayer = document.getElementById("video_player");
        // videoPlayer.onended = () => {
        //     const a = document.createElement('a');
        //     a.href = "/partA/introduction";
        //     a.click();
        // }
        // videoPlayer.play();
    }

    startTesting() {
        const a = document.createElement('a');
        a.href = "/partA/introduction";
        a.click();
    }

    render() {
        return (
            <div>
                {/* <p>介绍Part A, Part B的考试内容 结束后会产生report</p> */}
                <div className="heading">
                    <p className="part">Instruction</p>

                    
                    <div className="part_start_intro">
                        <p className="subtitle">Part A: Group Discussion (preparation: 10 minutes; discussion: 8 minutes per group of four candidates)</p>
                        <p className="content">
                            Four candidates will be grouped together and will take part in a group discussion based on a given shorttext. These texts may include advertisements, book synopses, film reviews, letters, short news reportsand so on. Candidates may be required to make suggestions, give advice, make and explain a choice, argue for and/or against a position, or discuss the pros and cons of a proposal.
                        </p>
                        <p className="content">
                            Candidates will be given ten minutes for preparation and will be allowed to make notes. During the discussion they may refer to their notes.
                        </p>
                    </div>
                    
                    <div className="part_start_intro">
                        <p className="subtitle">Part B: Individual Response (one minute per candidate)</p>
                        <p className="content">
                            Each candidate will respond individually to an examiner's question(s), which will be based on the group discussion task. Candidates may be required to make and justify a choice, decide on and explain a course of action, argue for or against a position, and so on.
                        </p>
                    </div>
                </div>
                <div className="board">
                    <div className="button_container">
                        <button className="button" onClick={this.startTesting}>
                            Start
                        </button>
                    </div>
                    {/* <div className="video_container">
                        <div className="camera_subcontainer">
                            <video id="video_player" src={mVideo} preload="auto"></video>
                            
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}

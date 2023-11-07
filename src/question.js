import React from "react"
import './css/question.css'
import questions from './text/questions.json'

let PART_A = 0;
let PART_B = 1;

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: props.part,
            question_num: props.q_num,
            text: questions.question_text["q" + props.q_num.toString()],
        };
        this.render = this.render.bind(this);
        this.switchPart = this.switchPart.bind(this);
    }

    switchPart() {
        var other_part = (this.state.part === PART_A)? PART_B : PART_A;
        this.setState({ part: other_part});
    }

    render() {
        if (this.state.part === PART_A){
            // console.log(this.state.text);
            console.log(this.state.text["partA"]);
            return(
                <div id="question_area">
                    <p id="part">Part A</p>
                    {/* <div className="tooltip-container">
                        <span id="part" onClick={this.switchPart}>Part A</span>
                        <span className="tooltip-text">Click to switch Part A/B</span>
                    </div> */}
                    <p id="intro">{this.state.text["source"]}</p>
                    <p id="title">{this.state.text["title"]}</p>
                    <p id="content">{this.state.text["content"]}</p>
                    <ul>
                        {this.state.text["partA"].map(item => <li key={item.id} className="partA_questions">{item.text}</li>)}
                    </ul>
                </div>
            );
        }
        else{
            var partB_question_list = this.state.text["partB"];
            var idx = parseInt(Math.random()*partB_question_list.length);
            return(
                <div id="question_area">
                    <p id="part">Part B</p>
                    <p id="intro">You have one minute to respond:</p>
                    {/* <div className="tooltip-container">
                        <span id="part" onClick={this.switchPart}>Part B</span>
                        <span className="tooltip-text">Click to switch Part A/B</span>
                    </div> */}
                    <p id="partB_question">{partB_question_list[idx]["text"]}</p>
                    {/* <ol>
                        {this.state.text["partB"].map(item => <li key={item.id} className="sub_questions">{item.text}</li>)}
                    </ol> */}
                </div>
            );
        }
    }
}


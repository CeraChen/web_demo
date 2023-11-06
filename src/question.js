import React from "react"
import './css/question.css'
import questions from './text/questions.json'

let PART_A = 0;
let PART_B = 1;
let Q_NUM = 1;

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: PART_B,
            question_num: Q_NUM,
            text: questions.question_text["q" + Q_NUM.toString()],
        };
        this.render = this.render.bind(this);
    }

    render() {
        if (this.state.part == PART_A){
            // console.log(this.state.text);
            console.log(this.state.text["partA"]);
            return(
                <div id="question_area">
                    <p id="part">Part A</p>
                    <p id="source">{this.state.text["source"]}</p>
                    <p id="title">{this.state.text["title"]}</p>
                    <p id="content">{this.state.text["content"]}</p>
                    <ul>
                        {this.state.text["partA"].map(item => <li key={item.id} className="sub_questions">{item.text}</li>)}
                    </ul>
                </div>
            );
        }
        else{
            return(
                <div id="question_area">
                    <p id="part">Part B</p>
                    <ol>
                        {this.state.text["partB"].map(item => <li key={item.id} className="sub_questions">{item.text}</li>)}
                    </ol>
                </div>
            );
        }
    }
}


import React from "react";
import {Link} from "react-router-dom";
import PartReport from "./part_result";
import '../css/mocktest.css'

const PART_A = 0;
const PART_B = 1; 

export default class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            q_num: props.q_num,
            current_part: PART_A,
        };
        this.render = this.render.bind(this);
        this.switchPartResult = this.switchPartResult.bind(this);
    }

    switchPartResult() {
        const partA_tooltip = document.getElementById("partA_tooltip");
        const partB_tooltip = document.getElementById("partB_tooltip");

        partA_tooltip.style.visibility = "hidden";
        partB_tooltip.style.visibility = "hidden";

        this.setState({
            current_part: (this.state.current_part + 1)%2,
        });
    }

    componentDidMount() {
        const partA_title = document.getElementById("partA_title");
        const partA_tooltip = document.getElementById("partA_tooltip");

        partA_title.addEventListener('mouseenter', (event) => {
            if(this.state.current_part !== PART_A) {
                partA_tooltip.style.visibility = "visible";
            }
        });

        partA_title.addEventListener('mouseleave', (event) => {
            if(this.state.current_part !== PART_A) {
                partA_tooltip.style.visibility = "hidden";
            }
        });
        
        const partB_title = document.getElementById("partB_title");
        const partB_tooltip = document.getElementById("partB_tooltip");

        partB_tooltip.style.transform = "translateX(73px)";
        
        partB_title.addEventListener('mouseenter', (event) => {
            if(this.state.current_part !== PART_B) {
                partB_tooltip.style.visibility = "visible";
            }
        });

        partB_title.addEventListener('mouseleave', (event) => {
            if(this.state.current_part !== PART_B) {
                partB_tooltip.style.visibility = "hidden";
            }
        });

        
        if(this.state.current_part === PART_A) {
            partB_title.addEventListener('click', this.switchPartResult);
        }
        else {
            partA_title.addEventListener('click', this.switchPartResult);
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if(this.state.current_part !== prevState.current_part) {            
            const partA_title = document.getElementById("partA_title");
            const partB_title = document.getElementById("partB_title");

            if(this.state.current_part === PART_A) {   
                partB_title.addEventListener('click', this.switchPartResult);
                partA_title.removeEventListener('click', this.switchPartResult);
            }
            else {
                partA_title.addEventListener('click', this.switchPartResult);
                partB_title.removeEventListener('click', this.switchPartResult);                
            }
        }
    }


    render() {
        console.log("get url");
        console.log(localStorage.getItem('partAUrl'));
        console.log(localStorage.getItem('partBUrl'));
        return (
            <div className="report_main">
                {/* <div>{localStorage.getItem('partAUrl')}</div>
                <div>{localStorage.getItem('partBUrl')}</div> */}
                <p className="part_title">
                    <span id="partA_title" className={(this.state.current_part === PART_A)? "chosen" : "unchosen"}>Part A</span>
                    <span id="partA_tooltip" className="part_tooltip"  onClick={this.switchPartResult}>switch to Part A</span>

                    <span id="partB_title" className={(this.state.current_part === PART_B)? "chosen" : "unchosen"}>Part B</span>
                    <span id="partB_tooltip" className="part_tooltip"  onClick={this.switchPartResult}>switch to Part B</span>
                </p>
                <div className="part_result">
                    {(this.state.current_part === PART_A) && <PartReport part={PART_A}></PartReport>}
                    {(this.state.current_part === PART_B) && <PartReport part={PART_B}></PartReport>}
                </div>
            </div>
        );
    }
}

import React from "react";
import {Link} from "react-router-dom";
import PartReport from "./part_result";
import '../css/mocktest.css'

import response_json_A from '../text/response_sample2.json'
import response_json_B from '../text/response_sample1.json'

const PART_A = 0;
const PART_B = 1; 

const MAX_FETCH_TIMES = 5;
const waitingInterval = 5000;
let mTimer = null;
let fetchCount;

function WaitDialog() {
    return (        
        <div className="waiting_dialog">
            <div className="waiting_dialog_container">  
                <p>Evaluating your answers ... Please wait for the scoring.</p>              
                <div className="spinner"></div>
            </div>
        </div>
    );
}


export default class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            q_num: props.q_num,
            current_part: PART_A,
            result_json_A: null,
            result_json_B: null,
            waiting: true,
        };
        this.render = this.render.bind(this);
        this.switchPartResult = this.switchPartResult.bind(this);
        this.fetchPartResult = this.fetchPartResult.bind(this);
        this.fetchResults = this.fetchResults.bind(this);

        fetchCount = 0;
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
        console.log("current waiting state: ", this.state.waiting); 
        if(this.state.waiting) {
            const result_container = document.getElementById("report_main");
            result_container.style.visibility = "hidden";

            this.fetchResults();
        }


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
                

        // if(!this.state.result_json_A) {
        //     console.log("update_A");
        //     fetchData(PART_A)
        //     .then((data) => {
        //         if(data) {
        //             this.setState({
        //                 result_json_A: data
        //             });
        //         }
        //     })
        //     .catch((error) => console.error(error));
        // }

        // if(!this.state.result_json_B) {
        //     console.log("update_B");
        //     fetchData(PART_B)
            
        // }

    }


    componentDidUpdate(prevProps, prevState) {
        if(this.state.waiting !== prevState.waiting) {
            const result_container = document.getElementById("report_main");
            result_container.style.visibility = (this.state.waiting)? "hidden" : "visible";
        }

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


    fetchResults() {     
        fetchCount += 1;   
        try {
            clearTimeout(mTimer);
            mTimer = null;
        } catch(error) {
            console.log("error when clearing timer");
            console.log(error);
        }

        if(fetchCount > MAX_FETCH_TIMES || (this.state.result_json_A && this.state.result_json_B)) {
            if(!(this.state.result_json_A && this.state.result_json_B)) {
                mTimer = setTimeout(this.fetchResults, waitingInterval);
            }
            
            if(this.state.waiting) {                
                this.setState({
                    waiting: false,
                });
            }
        }
        else {
            if(!this.state.result_json_A) {
                this.fetchPartResult(PART_A);
            }
            if(!this.state.result_json_B) {
                this.fetchPartResult(PART_B);
            }

            mTimer = setTimeout(this.fetchResults, waitingInterval);
        }
    }


    fetchPartResult(part) {
        const fetchData = async (mPart) => {
            try {                
                console.log('fetch', mPart);
                // ask for the speechace result from the backend
                // replace '/get_part_result' with 'http://{your_ip}:{your_port}/get_part_result' 
                const response = await fetch('/get_part_result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: localStorage.getItem((mPart === PART_A)? "id_A" : "id_B"),
                        part: mPart,
                    }),
                });
                const data = await response.json();
                console.log(data);
                return data;
            } catch (error) {
                console.log("Fail to fetch part result", mPart);
            }
        };

        fetchData(part)
        .then((data) => {
            if(data) {
                console.log("inside fetchData, current part is ", part);
                if(part === PART_A) {
                    this.setState({
                        result_json_A: data
                    });
                }
                else {
                    this.setState({
                        result_json_B: data
                    });
                }
            }
        })
        .catch((error) => console.error(error));
    }


    render() {
        console.log("get url");
        console.log(localStorage.getItem('id_A'));
        console.log(localStorage.getItem('id_B'));
        return (
            <div>
                { this.state.waiting && <WaitDialog></WaitDialog> }

                <div id="report_main">
                    {/* <div>{localStorage.getItem('partAUrl')}</div>
                    <div>{localStorage.getItem('partBUrl')}</div> */}
                    <p className="part_title">
                        <span id="partA_title" className={(this.state.current_part === PART_A)? "chosen" : "unchosen"}>Part A</span>
                        <span id="partA_tooltip" className="part_tooltip"  onClick={this.switchPartResult}>switch to Part A</span>

                        <span id="partB_title" className={(this.state.current_part === PART_B)? "chosen" : "unchosen"}>Part B</span>
                        <span id="partB_tooltip" className="part_tooltip"  onClick={this.switchPartResult}>switch to Part B</span>
                    </p>
                    <div className="part_result">
                        {(this.state.current_part === PART_A) && <PartReport part={PART_A} reuslt_json={ this.state.result_json_A || response_json_A}></PartReport>}
                        {(this.state.current_part === PART_B) && <PartReport part={PART_B} reuslt_json={ this.state.result_json_B || response_json_B}></PartReport>}
                    </div>
                </div>
            </div>
        );
    }
}

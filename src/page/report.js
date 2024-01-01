import React from "react";
import {Link} from "react-router-dom";
import PartReport from "./part_result";

const PART_A = 0;
const PART_B = 1; 

export default class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            q_num: props.q_num,
        };
        this.render = this.render.bind(this);
    }


    render() {
        console.log("get url");
        console.log(localStorage.getItem('partAUrl'));
        return (
            <div>
                <div>{localStorage.getItem('partAUrl')}</div>
                <div>{localStorage.getItem('partBUrl')}</div>
                <PartReport part={PART_A}></PartReport>
            </div>
        );
    }
}

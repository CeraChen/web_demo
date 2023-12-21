import React from "react";
import {Link} from "react-router-dom";

const PART_A = 0;
const PART_B = 1; 

export default class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            q_num: props.q_num,
        };
        this.render = this.render.bind(this);
        this.getUrl = (part) => props.get_url(part);
    }


    render() {
        return (
            <div>
                {this.getUrl(PART_A)}
                {/* <Link to="/partA/instruction">start</Link> */}
            </div>
        );
    }
}

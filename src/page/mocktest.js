import React from "react";
import { Link } from "react-router-dom";


const PART_A = 0;
const PART_B = 1;


export default class MockTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            part: props.part,
            q_num: props.q_num,
        };
        this.render = this.render.bind(this);
        this.updateUrl = (part, newUrl) => props.update_url(part, newUrl);
    }



    render() {
        const nextPage = (this.state.part === PART_A)? "../../partB/introduction" : "../../report";
        
        return(
            // <div>
            //     <div className="question_area">
            //         <p className="part">{mPart}</p>
            //         <p className="guide">{mGuide}</p>
            //         <p className="part_guide">{mText}</p>
            //     </div>
            // </div>

            <div onClick={this.updateUrl(this.state.part, "hihi")}>
                <Link to={nextPage}>Intro counting down</Link>
            </div>
        );
    }
}
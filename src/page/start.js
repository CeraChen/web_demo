import React from "react";
import {Link} from "react-router-dom";


export default class StartPage extends React.Component{
    render() {
        return (
            <div>
                <p>介绍Part A, Part B的考试内容 结束后会产生report</p>
                <Link to="/partA/introduction">start</Link>
            </div>
        );
    }
}

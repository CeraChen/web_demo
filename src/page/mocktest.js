import React from "react";
import RecordBtn from '../recordBtn';
import Question from '../question';
import { useParams } from 'react-router-dom';

let PART_A = 0;
let PART_B = 1; 

// export default class MockTest extends React.Component {
function MockTest() {
    const { part } = useParams(); //this.props.match.params;
    var mPart = (part === 'A')? PART_A : PART_B;
    return (
        <div>
            <Question part={mPart} q_num={1}/>
            <RecordBtn part={mPart}/>
        </div>
    );
}

export default MockTest;
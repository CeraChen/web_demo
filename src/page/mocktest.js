import React, { useState, useCallback } from "react";
import RecordBtn from '../recordBtn';
import { useParams } from 'react-router-dom';

let PART_A = 0;
let PART_B = 1; 

// export default class MockTest extends React.Component {
function MockTest() {
    const { part } = useParams(); //this.props.match.params;
    var mPart = (part === 'A')? PART_A : PART_B;
    return (
        <div>
            <RecordBtn part={mPart} q_num={1}/>
        </div>
    );
}

export default MockTest;
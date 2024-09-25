import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/mocktest.css"


const PART_A = 0;
const PART_B = 1;

const countDownTime = [5000, 5000];
const sparkTime = 200;
const intervalTime = 1000 - sparkTime;

let leftTime;
let mTimer = null;



function Intro( { part } ) {
    const navigate = useNavigate();
    const [buttonClass, setButtonClass] = useState("spark");
    const [buttonText, setButtonText] = useState(parseInt(leftTime/1000).toString());

    
    console.log(part);
    var mPart = (part === PART_A)? "Part A" : "Part B";
    var mText = (part === PART_A)? "You will then have 10 minutes to prepare for group discussion." :
            "You will have 1 minute to answer directly.";
    var mGuide = "After the countdown ends, the question will be automatically displayed.";



    function spark() {
        clearTimeout(mTimer);

        leftTime -= sparkTime;
        console.log("spark");
        console.log(leftTime);

        if (leftTime > 0) {
            setButtonClass("spark");
            setButtonText(parseInt(leftTime/1000 + 1).toString());
            mTimer = setTimeout(interval, sparkTime);
        }
        else{
            var nextPage = (part === PART_A)? "../../partA/mocktest" : "../../partB/mocktest";
            navigate(nextPage);
        }
    }

    function interval() {
        clearTimeout(mTimer);

        leftTime -= intervalTime;
        console.log("interval");
        console.log(leftTime);
        
        setButtonClass("interval");
        mTimer = setTimeout(spark, intervalTime);
    }


    useEffect(() => {
        leftTime = countDownTime[part];
        mTimer = setTimeout(spark, 0);
        return () => {
        };
      }, [part]);


    return(
        <div>
            <div className="heading">
                <p className="part">{mPart}</p>
                <p className="guide">{mGuide}</p>
                <p className="part_guide">{mText}</p>
            </div>
            <div className="button_area">
                <button id="count_down" className={buttonClass}>
                    {buttonText}
                </button>
            </div>
        </div>
    );

}

export default Intro;
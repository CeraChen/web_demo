import React, { useEffect, useState, useRef } from "react"
import '../css/part_report.css'
import arpabet from '../text/arpabet.json'


const PART_A = 0;
const PART_B = 1; 

const FULL_SCORE = 100; //9
const STRESS_BAR = 25;

const boundary = 70;

function ScoreBar({ score , overall }) {
    const progressPercentage = (score / FULL_SCORE) * 100;
    // console.log(score);

    var mHeight = (overall)? "18px" : "17px";
    var mColor = (overall)? "mediumseagreen" : "lightgreen";
    var mBgColor = (overall)? "slategray" : "lightslategray";
  
    return (
      <div>
        <div className="progress_bar" style={{ width: `${progressPercentage}%`}}>
          <button className="short_bar" style={{ height: `${mHeight}`, backgroundColor: `${mColor}` }}></button>
        </div>
        <button className="long_bar" style={{ height: `${mHeight}`, backgroundColor: `${mBgColor}`}}></button>
      </div>
    );
  }


function PartFeedback({ part, reuslt_json }) {
    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    const spanRef = useRef();

    const mPart = (part === PART_A)? "Part A" : "Part B";
    const response_json = reuslt_json;
    // var response_json = (part === PART_A)? response_json_A : response_json_B;
    
    console.log(response_json);

    

    const get_voicing_list = (mJson) => {
        var pause_list = [];
        var pitch_list = [];
        var extent_list = [];
        console.log('pause enter!!');

        if (!mJson?.speech_score?.word_score_list) {
            console.log("no score!!!");
            return [pause_list, pitch_list];
        } 

        for(var word_idx = 0; word_idx < mJson["speech_score"]["word_score_list"].length; word_idx++) {
            var pitches = [];
            var extents = [];
            const syllables = mJson["speech_score"]["word_score_list"][word_idx]["syllable_score_list"];
            const syllable_count = syllables.length;


            for (var syllable of syllables) {
                console.log(syllable);
                if (syllable["pitch_range"]) {                    
                    pitches.push(syllable["pitch_range"][0]);
                    pitches.push(syllable["pitch_range"][1]);
                }

            }

            if (pitches.length <= 1) {                
                pitch_list.push("no_stress");
            }
            else {                
                const pitch_sum =  pitches.reduce((accumulator, currentValue) => accumulator + currentValue);
                const pitch_mean = pitch_sum / pitches.length;
                console.log(pitch_mean);
                const pow_sum = pitches.reduce((accumulator, currentValue) => accumulator + Math.pow(currentValue - pitch_mean, 2));
                const pitch_sd = Math.sqrt(pow_sum / pitches.length);
                pitch_list.push((pitch_sd > STRESS_BAR)? "stress" : "no_stress");
            }



            if (word_idx < mJson["speech_score"]["word_score_list"].length-1) {
                var interval = mJson["speech_score"]["word_score_list"][word_idx+1]["syllable_score_list"][0]["extent"][0] - 
                               mJson["speech_score"]["word_score_list"][word_idx]["syllable_score_list"][syllable_count-1]["extent"][1];
                var interval_type;
                if (interval >= 50) {
                if (interval < 100) {
                    interval_type = "brief_pause"; // brief pause
                }
                else {
                    if (interval < 200) {
                        interval_type = "master_pause"; // master pause
                    }
                    else {
                        interval_type = "long_pause"; // long pause
                    }
                }
                }
                else {
                interval_type = "no_pause"; // no pause
                }

                pause_list.push(interval_type);
                console.log(interval_type);
            }
        }
        return [pause_list, pitch_list];
    };    
    const list_results = get_voicing_list(response_json);
    const pauses_type_list = list_results[0];
    const pitches_type_list = list_results[1];
    console.log(pauses_type_list);
    console.log(pitches_type_list);



    const handleSpanClick = (index) => {
        if (expandedItemIndex === index) {
            // console.log("click two");
            setExpandedItemIndex(null);
        } else {
            // console.log("click three");
            setExpandedItemIndex(index);
        }
    };


    
    const handleOutsideClick = (event) => {
        if (spanRef.current && !spanRef.current.contains(event.target)) {
            // console.log("click one");
            setExpandedItemIndex(null);
        }
    };


    const getErrorDetailPosition = () => {
        if (spanRef.current) {
            const errorDetail = spanRef.current.querySelector(".error_detail");
            const errorDetailWidth = errorDetail.offsetWidth;
            const screenWidth = window.innerWidth;
            const word = document.getElementById(expandedItemIndex.toString());
            const wordLeft = word.offsetLeft;


            if(wordLeft < 0){
                errorDetail.style.left = `${wordLeft}px`;
                errorDetail.style.top = "56px";
            }
            else{
                if (errorDetailWidth + spanRef.current.getBoundingClientRect().left > screenWidth) {
                    errorDetail.style.left = "auto";
                    errorDetail.style.right = "0";
                } else {
                    errorDetail.style.left = "0";
                    errorDetail.style.right = "auto";
                }
            }
        
        }
    };
    

    useEffect(() => {
        getErrorDetailPosition();
    }, [expandedItemIndex]);



    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    return (
        <div className={(mPart === PART_A)? "partA" : "partB"}>
            <div className="score_container">
                <div className="ielts_scores">
                    <div className="score_item">
                        <div className="score_label">
                            <span className="overall_score_text">Overall:</span>
                            <span className="overall_score_value">{response_json?.speech_score?.speechace_score?.overall || 0}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json?.speech_score?.speechace_score?.overall || 0} overall={true}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Pronunciation:</span>
                            <span className="sub_score_value">{response_json?.speech_score?.speechace_score?.pronunciation || 0}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json?.speech_score?.speechace_score?.pronunciation || 0} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Fluency:</span>
                            <span className="sub_score_value">{response_json?.speech_score?.speechace_score?.fluency || 0}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json?.speech_score?.speechace_score?.fluency || 0} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Coherence:</span>
                            <span className="sub_score_value">{response_json?.speech_score?.speechace_score?.coherence || 0}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json?.speech_score?.speechace_score?.coherence || 0} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Grammar:</span>
                            <span className="sub_score_value">{response_json?.speech_score?.speechace_score?.grammar || 0}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json?.speech_score?.speechace_score?.grammar || 0} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Vocabulary:</span>
                            <span className="sub_score_value">{response_json?.speech_score?.speechace_score?.vocab || 0}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json?.speech_score?.speechace_score?.vocab || 0} overall={false}></ScoreBar>
                        </div>
                    </div>

                    {<p className="relevance_warning">
                        {
                            ((response_json?.speech_score?.relevance?.class || "TRUE") !== "TRUE")? 
                            <span className="bold_warning">Warning: </span> :
                            ""
                        }
                        {
                            ((response_json?.speech_score?.relevance?.class || "TRUE") !== "TRUE")? 
                            <span> your answer has been detected as irrelevant to the question.</span> :
                            ""                            
                        }
                    </p>}
                </div>
            </div>

            <div className="text_area">
                <p className="report_title">Your answer:</p>
                <div className="script">
                    { (response_json?.speech_score?.word_score_list || false) && 
                        response_json["speech_score"]["word_score_list"].map((item, index) => {
                            var syllable_marks = new Array(item.phone_score_list.length).fill(0);
                            var syllables = new Array(item.phone_score_list.length).fill('');
                            var last_pos = 0;
                            for(var syllable of item.syllable_score_list) {
                                syllable_marks[last_pos] = syllable.phone_count;
                                syllables[last_pos] = syllable.letters;
                                last_pos += syllable.phone_count;
                            }
                            
                            var correct_mark = true;
                            if(item.quality_score <= boundary) {                            
                                for(var phone_idx=0; phone_idx<item.phone_score_list.length; phone_idx ++) {
                                    var phone = item.phone_score_list[phone_idx].phone;
                                    if(phone_idx === item.phone_score_list.length-1) {
                                        // console.log("last", phone, item.phone_score_list[phone_idx].sound_most_like)
                                        if(item.phone_score_list[phone_idx].sound_most_like) {
                                            correct_mark = false;
                                        }
                                    }
                                    else {
                                        // console.log("middle", phone, item.phone_score_list[phone_idx].sound_most_like)
                                        if(item.phone_score_list[phone_idx].sound_most_like !== phone) {
                                            correct_mark = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            // console.log("result", correct_mark);


                            return (
                                <span className="container" ref={(expandedItemIndex === index)? spanRef : null}>
                                    {expandedItemIndex === index && (
                                        <span className="error_detail">
                                            <table className="phone_tab">
                                                <thead>
                                                    <tr>
                                                        <th>Syllable</th>
                                                        <th>Phone</th>
                                                        <th>Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.phone_score_list.map((phone, idx) => (
                                                        <tr>
                                                            {(syllable_marks[idx] > 0) && (<td rowSpan={syllable_marks[idx]}>{syllables[idx]}</td>)}
                                                            <td className={(phone.sound_most_like === phone.phone)? "correct" : "incorrect"}>{arpabet[phone.phone] || phone.phone}</td>
                                                            <td className={(phone.sound_most_like === phone.phone)? "correct" : "incorrect"}>{(phone.sound_most_like)? ((phone.sound_most_like === phone.phone)? 'Good' : arpabet[phone.sound_most_like]) : '[missing]'}</td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                            </table>
                                        </span>
                                    )}
                                    <span id={index.toString()} className={pitches_type_list[index] || "correct"}>
                                        {/* className={correct_mark?
                                            // (item.quality_score > boundary)?
                                            ((expandedItemIndex === index)? "active_correct" : "correct") : 
                                            ((expandedItemIndex === index)? "active_incorrect" : "incorrect")} 
                                        onClick={() => handleSpanClick(index)}> */}
                                        {item.word}
                                    </span>
                                    <span className={ pauses_type_list[index] }>{item.ending_punctuation} </span>
                                    {/* <span className="correct">{pauses_type_list[index]} </span> */}
                                </span>);
                        }
                    )}
                    
                    {(!response_json?.speech_score?.word_score_list) &&
                    (                        
                        (
                            (response_json?.detail_message) && 
                            <span className="container">                            
                                <span className="blank_warning">
                                    [Sorry, the system has detected that you did not answer this question.]
                                </span>
                            </span>
                        ) ||
                        (
                            <span className="container">                            
                                <span className="blank_warning">
                                    [Sorry, the system has failed to detect your speech.]
                                </span>
                            </span>
                        )
                    )
                    }
                </div>
            </div>
        </div>
    );
}

export default PartFeedback;
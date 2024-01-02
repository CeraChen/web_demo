import React, { useEffect, useState, useRef } from "react"
import '../css/part_report.css'
import response_json from '../text/response_sample2.json'


const PART_A = 0;
const PART_B = 1; 

let boundary = 70;

function ScoreBar({ score , overall }) {
    const progressPercentage = (score / 9) * 100;
    console.log(score);

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


function PartReport({ part }) {
    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    const spanRef = useRef();

    var mPart = (part === PART_A)? "Part A" : "Part B";


    console.log(response_json);

    const handleSpanClick = (index) => {
        if (expandedItemIndex === index) {
            console.log("click two");
            setExpandedItemIndex(null);
        } else {
            console.log("click three");
            setExpandedItemIndex(index);
        }
    };


    
    const handleOutsideClick = (event) => {
        if (spanRef.current && !spanRef.current.contains(event.target)) {
            console.log("click one");
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
                            <span className="overall_score_text">IELTS overall:</span>
                            <span className="overall_score_value">{response_json["speech_score"]["ielts_score"]["overall"]}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json["speech_score"]["ielts_score"]["overall"]} overall={true}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Pronunciation:</span>
                            <span className="sub_score_value">{response_json["speech_score"]["ielts_score"]["pronunciation"]}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json["speech_score"]["ielts_score"]["pronunciation"]} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Fluency:</span>
                            <span className="sub_score_value">{response_json["speech_score"]["ielts_score"]["fluency"]}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json["speech_score"]["ielts_score"]["fluency"]} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Coherence:</span>
                            <span className="sub_score_value">{response_json["speech_score"]["ielts_score"]["coherence"]}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json["speech_score"]["ielts_score"]["coherence"]} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Grammar:</span>
                            <span className="sub_score_value">{response_json["speech_score"]["ielts_score"]["grammar"]}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json["speech_score"]["ielts_score"]["grammar"]} overall={false}></ScoreBar>
                        </div>
                    </div>
                    
                    <div className="score_item">
                        <div className="score_label">
                            <span className="sub_score_text">Vocabulary:</span>
                            <span className="sub_score_value">{response_json["speech_score"]["ielts_score"]["vocab"]}</span>
                        </div>
                        <div className="score_bar">
                            <ScoreBar score={response_json["speech_score"]["ielts_score"]["vocab"]} overall={false}></ScoreBar>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text_area">
                <p className="report_title">Your answer:</p>
                <div className="script">
                    {response_json["speech_score"]["word_score_list"].map((item, index) => {
                        var syllable_marks = new Array(item.phone_score_list.length).fill(0);
                        var syllables = new Array(item.phone_score_list.length).fill('');
                        var last_pos = 0;
                        for(var syllable of item.syllable_score_list) {
                            syllable_marks[last_pos] = syllable.phone_count;
                            syllables[last_pos] = syllable.letters;
                            last_pos += syllable.phone_count;
                        }
                                    


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
                                                        <td className={(phone.sound_most_like === phone.phone)? "correct" : "incorrect"}>{phone.phone}</td>
                                                        <td className={(phone.sound_most_like === phone.phone)? "correct" : "incorrect"}>{(phone.sound_most_like)? ((phone.sound_most_like === phone.phone)? 'Good' : phone.sound_most_like) : '[missing]'}</td>
                                                    </tr>
                                                )
                                                )}
                                            </tbody>
                                        </table>
                                    </span>
                                )}
                                <span id={index.toString()} 
                                    className={(item.quality_score > boundary)?
                                        ((expandedItemIndex === index)? "active_correct" : "correct") : 
                                        ((expandedItemIndex === index)? "active_incorrect" : "incorrect")} 
                                    onClick={() => handleSpanClick(index)}>
                                    {item.word}
                                </span>
                                <span className="correct">{item.ending_punctuation} </span>
                            </span>);
                        }
                    )}
                </div>
            </div>
        </div>
    );
}

export default PartReport;
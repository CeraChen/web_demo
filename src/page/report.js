import React, { useEffect, useState, useRef } from "react"
import '../css/report.css'
import response_json from '../text/response_sample2.json'


let boundary = 70;

function ScoreBar({ score }) {
    const progressPercentage = (score / 9) * 100;
    console.log(score);
  
    return (
      <div className="score_bar">
        <div className="progress_bar" style={{ width: `${progressPercentage}%`}}>
          <button className="short_bar"></button>
        </div>
        <button className="long_bar"></button>
      </div>
    );
  }


function Report() {
    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    const spanRef = useRef();


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


    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    return (
        <div className="text_area">
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
            <div className="score_container">
                <div className="scores">
                    {/* <div className="overall_score">IELTS overall: {response_json["speech_score"]["ielts_score"]["overall"]}</div> */}
                    <div className="ielts_scores">
                        <table className="ielts_score_table">
                            <thead>
                                <tr>
                                    <th className="overall_score_text">IELTS overall:</th>
                                    <th className="overall_score_value">{response_json["speech_score"]["ielts_score"]["overall"]}</th>
                                    <th><ScoreBar score={response_json["speech_score"]["ielts_score"]["overall"]}></ScoreBar></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="sub_score_text">Pronunciation:</td>
                                    <td className="sub_score_value">{response_json["speech_score"]["ielts_score"]["pronunciation"]}</td>
                                    <td><ScoreBar score={response_json["speech_score"]["ielts_score"]["pronunciation"]}></ScoreBar></td>
                                </tr>
                                <tr>
                                    <td className="sub_score_text">Fluency:</td>
                                    <td className="sub_score_value">{response_json["speech_score"]["ielts_score"]["fluency"]}</td>
                                    <td><ScoreBar score={response_json["speech_score"]["ielts_score"]["fluency"]}></ScoreBar></td>
                                </tr>
                                <tr>
                                    <td className="sub_score_text">Coherence:</td>
                                    <td className="sub_score_value">{response_json["speech_score"]["ielts_score"]["coherence"]}</td>
                                    <td><ScoreBar score={response_json["speech_score"]["ielts_score"]["coherence"]}></ScoreBar></td>
                                </tr>
                                <tr>
                                    <td className="sub_score_text">Grammar:</td>
                                    <td className="sub_score_value">{response_json["speech_score"]["ielts_score"]["grammar"]}</td>
                                    <td><ScoreBar score={response_json["speech_score"]["ielts_score"]["grammar"]}></ScoreBar></td>
                                </tr>
                                <tr>
                                    <td className="sub_score_text">Vocabulary:</td>
                                    <td className="sub_score_value">{response_json["speech_score"]["ielts_score"]["vocab"]}</td>
                                    <td><ScoreBar score={response_json["speech_score"]["ielts_score"]["vocab"]}></ScoreBar></td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <div>Pronunciation: {response_json["speech_score"]["ielts_score"]["pronunciation"]}</div>
                        <div>Fluency: {response_json["speech_score"]["ielts_score"]["fluency"]}</div>
                        <div>Coherence: {response_json["speech_score"]["ielts_score"]["coherence"]}</div>
                        <div>Grammar: {response_json["speech_score"]["ielts_score"]["grammar"]}</div>
                        <div>Vocabulary: {response_json["speech_score"]["ielts_score"]["vocab"]}</div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;
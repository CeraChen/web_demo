import React, { useEffect, useState, useRef } from "react"
import '../css/part_report.css'
import arpabet from '../text/arpabet.json'
import RadarChart from './radar.js'


const PART_A = 0;
const PART_B = 1; 

const FULL_SCORE = 100; //9
const STRESS_BAR = 30;
const STRESS_PERCENT = 6;
const EXTENT_SHORT_BAR = 15;
const EXTENT_LONG_BAR = 30;
const EXTENT_SHORT_PERCENT = 15;
const EXTENT_LONG_PERCENT = 8;
const SKIP_WORDS = ["the", "a", "an", "I", "this", "that"];

const boundary = 70;

// var show_stress = false;
// var show_speed = true;
// var show_pause = true;
var pauses_type_list = [];
var pitches_type_list = [];
var extents_type_list = [];


// var pronunciation_score_list = [];
// var fluency_score_list = [];
// var grammar_score_list = [];
// var coherence_score_list = [];
// var vocab_score_list = [];

var score_lists = [];
const subscore_label_list = ["No Subscore", "Pronunciation", "Fluency", "Grammar", "Coherence", "Vocabulary"];
const radar_label_list = ["Show Details", "Show Scores"]

// const mColors = [[255, 255, 255, 0.0], 
//     [215, 243, 218, 0.5], 
//     [255, 235, 205, 0.5], 
//     [0, 255, 255, 0.3],
//     [255, 192, 203, 0.3],
//     [127, 255, 212, 0.3]]
const mColors = [[21,3,251], [42,72,235], [52,116,235], [24,149,255], [1,184,255], [94,196,244], [168,218,242], [255,253,177], [255,228,63], [255,189,15], [255,144,0], [255,89,0], [255,5,0], [214,0,0]];
// [215, 241, 242, 0.5], [215, 243, 218, 0.5], [215, 241, 242, 0.5], [215, 243, 218, 0.5] ]
// [218, 215, 242, 0.5], [243, 215, 240, 0.5], [244, 218, 217, 0.5]]

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

function rgbToHex(r, g, b) {
    // 将RGB分量的值限制在0到255之间
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
  
    // 将十进制的RGB值转换为十六进制字符串
    var hexR = r.toString(16).padStart(2, "0");
    var hexG = g.toString(16).padStart(2, "0");
    var hexB = b.toString(16).padStart(2, "0");
  
    // 拼接十六进制颜色值并返回
    var hexColor = "#" + hexR + hexG + hexB;
    return hexColor;
}
  


function WordSpan({ show_speed, show_stress, show_pause, show_subscore, index, word, punc, onclick }) {
    var mColor = [255, 255, 255, 0];
    // mColors[show_subscore].slice();
    if (show_subscore > 0) {
        const score_list = score_lists[show_subscore - 1];
        const color_idx = parseInt(score_list[index]/100 * mColors.length);
        console.log("subscore", score_list[index])
        // mColor[0] *= (Math.pow(score_list[index], 2)/10000);
        // mColor[1] *= (Math.pow(score_list[index], 2)/10000);
        // mColor[2] *= (Math.pow(score_list[index], 2)/10000);
        for (var i=0; i<3; i++) {
            mColor[i] = mColors[color_idx][i];
            // (mColors[0][i] * score_list[index]/100) + (mColors[1][i] * (1-score_list[index]/100));
        }
        mColor[3] = 0.6;
        console.log(mColor);
    }
    
    var mSpan = (
        // <span style={{ backgroundColor: rgbToHex(mColor[0], mColor[1], mColor[2]) }} className={(show_speed)? extents_type_list[index] : "correct"}>
        // color: (mColor[0]+mColor[1]+mColor[2] < 360)? "white":"black" }} className={(show_speed)? extents_type_list[index] : "correct"}>
        <span style={{ backgroundColor: `rgba(${mColor[0]}, ${mColor[1]}, ${mColor[2]}, ${mColor[3]})`}} className={(show_speed)? extents_type_list[index] : "correct"}>
            <span id={index.toString()} className={(show_stress)? pitches_type_list[index] : "correct"} onClick={() => onclick(index)}>
                {word}
            </span>
            <span className={(show_pause)? pauses_type_list[index] : "correct"}>{punc} </span>
        </span>
    );

    return mSpan;
}


function PartFeedback({ part, reuslt_json }) {
    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    const [show_stress, setShowStress] = useState(false);
    const [show_speed, setShowSpeed] = useState(false);
    const [show_pause, setShowPause] = useState(false);

    const [pause_bar1, setPauseBar1] = useState(50);
    const [pause_bar2, setPauseBar2] = useState(100);
    const [pause_bar3, setPauseBar3] = useState(200);

    
    const [extent_bar_long, setExtentBarLong] = useState(EXTENT_LONG_BAR);
    const [extent_bar_short, setExtentBarShort] = useState(EXTENT_SHORT_BAR);


    const [stress_bar, setStressBar] = useState(STRESS_BAR);
    

    
    // const [show_pronunciation, setShowPronunciation] = useState(false);
    // const [show_fluency, setShowFluency] = useState(false);
    // const [show_grammar, setShowGrammar] = useState(false);
    // const [show_coherence, setShowCoherence] = useState(false);
    // const [show_vocab, setShowVocab] = useState(false);
    const [show_subscore, setShowSubscore] = useState(0);
    // 0 none, 1 pronunciation, 2 fluency, 3 grammar, 4 coherence, 5 vocab

    const [show_radar, setShowRadar] = useState(false);

    const spanRef = useRef();

    const mPart = (part === PART_A)? "Part A" : "Part B";
    const response_json = reuslt_json;
    // var response_json = (part === PART_A)? response_json_A : response_json_B;
    
    console.log(response_json);

    
    const handlePauseBar1 = (e) => {
        setPauseBar1(e.target.value);
    };    
    const handlePauseBar2 = (e) => {
        setPauseBar2(e.target.value);
    };    
    const handlePauseBar3 = (e) => {
        setPauseBar3(e.target.value);
    };


    
    const handleExtentBarLong = (e) => {
        setExtentBarLong(e.target.value);
    };
    const handleExtentBarShort = (e) => {
        setExtentBarShort(e.target.value);
    };


    const handleStressBar = (e) => {
        setStressBar(e.target.value);
    };



    const get_voicing_list = (mJson) => {
        var pause_list = [];
        var pitch_list = [];
        var extent_list = [];
        var word_average_extents = [];
        var word_sd_pitches = [];
        console.log('enter!!');

        if (!mJson?.speech_score?.word_score_list) {
            console.log("no score!!!");
            return [pause_list, pitch_list, extent_list];
        } 

        for(var word_idx = 0; word_idx < mJson["speech_score"]["word_score_list"].length; word_idx++) {
            var pitches = [];
            var extents = [];
            const syllables = mJson["speech_score"]["word_score_list"][word_idx]["syllable_score_list"];
            const syllable_count = syllables.length;


            for (var syllable of syllables) {
                // console.log(syllable);
                if (syllable["pitch_range"]) {                    
                    pitches.push(syllable["pitch_range"][0]);
                    pitches.push(syllable["pitch_range"][1]);
                }
                if (syllable["extent"]) {
                    extents.push(syllable["extent"][1] - syllable["extent"][0])
                }
            }

            if (pitches.length <= 1) {                
                // pitch_list.push("no_stress");
                word_sd_pitches.push(0);
            }
            else {                
                const pitch_sum =  pitches.reduce((accumulator, currentValue) => accumulator + currentValue);
                const pitch_mean = pitch_sum / pitches.length;
                // console.log(pitch_mean);
                const pow_sum = pitches.reduce((accumulator, currentValue) => accumulator + Math.pow(currentValue - pitch_mean, 2));
                const pitch_sd = Math.sqrt(pow_sum / pitches.length);
                word_sd_pitches.push(pitch_sd);
                // pitch_list.push((pitch_sd > STRESS_BAR)? "stress" : "no_stress");
            }

            const extent_sum =  extents.reduce((accumulator, currentValue) => accumulator + currentValue);
            const extent_mean = extent_sum / extents.length;
            word_average_extents.push(extent_mean);
            // extent_list.push((extent_mean < EXTENT_SHORT_BAR)? "high_speed" : ((extent_mean >= EXTENT_LONG_BAR)? "low_speed" : "normal_speed"));


            if (word_idx < mJson["speech_score"]["word_score_list"].length-1) {
                var interval = mJson["speech_score"]["word_score_list"][word_idx+1]["syllable_score_list"][0]["extent"][0] - 
                               mJson["speech_score"]["word_score_list"][word_idx]["syllable_score_list"][syllable_count-1]["extent"][1];
                var interval_type;
                if (interval >= pause_bar1) {
                    if (interval < pause_bar2) {
                        interval_type = "brief_pause"; // brief pause
                    }
                    else {
                        if (interval < pause_bar3) {
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

        var tmp_extents = [...word_average_extents];
        tmp_extents.sort(function(a, b) {
            return b - a;
        });

        var tmp_pitches = [...word_sd_pitches];
        tmp_pitches.sort(function(a, b) {
            return b - a;
        });

        const index_long = Math.ceil((EXTENT_LONG_PERCENT / 100) * tmp_extents.length) - 1;
        const index_short = Math.ceil((1 - (EXTENT_SHORT_PERCENT / 100)) * tmp_extents.length) - 1;
        // const extent_long = Math.max(tmp_extents[index_long], EXTENT_LONG_BAR);
        // const extent_short = Math.min(tmp_extents[index_short], EXTENT_SHORT_BAR);
        const extent_long = Math.max(tmp_extents[index_long], extent_bar_long);
        const extent_short = Math.min(tmp_extents[index_short], extent_bar_short);
        console.log("extent_long", extent_long);
        console.log("extent_short", extent_short);

        const index_stress = Math.ceil((STRESS_PERCENT / 100) * tmp_pitches.length) - 1;
        const sd_stress = Math.max(tmp_pitches[index_stress], stress_bar);
        console.log("sd_stress", sd_stress);

        for (var word_idx=0; word_idx<word_average_extents.length; word_idx++) {
            if (word_average_extents[word_idx] > extent_long) {
                extent_list.push("low_speed");
            }
            else {
                if (!SKIP_WORDS.includes(mJson["speech_score"]["word_score_list"][word_idx]["word"]) & word_average_extents[word_idx] < extent_short) {
                    extent_list.push("high_speed");
                    // console.log(word_average_extents[word_idx], extent_short);
                }
                else {
                    extent_list.push("normal_speed");
                }
            }

            if (word_sd_pitches[word_idx] > sd_stress) {
                pitch_list.push("stress");
            }
            else {
                pitch_list.push("no_stress");
            }
        }
        
        return [pause_list, pitch_list, extent_list];
    };    
    const list_results = get_voicing_list(response_json);
    pauses_type_list = list_results[0];
    pitches_type_list = list_results[1];
    extents_type_list = list_results[2];

    const get_segment_list = (mJson) => {
        var word_segment_pronunciation_scores = [];
        var word_segment_fluency_scores = [];
        var word_segment_grammar_scores = [];
        var word_segment_coherence_scores = [];
        var word_segment_vocab_scores = [];

        if (!mJson?.speech_score?.fluency?.segment_metrics_list || mJson?.speech_score?.word_score_list.length < 1) {
            console.log("no segment!!!");
            return [
                word_segment_pronunciation_scores,
                word_segment_fluency_scores,
                word_segment_grammar_scores,
                word_segment_coherence_scores,
                word_segment_vocab_scores
            ];
        } 

        // console.log("mJson.speech_score.fluency.segment_metrics_list", mJson.speech_score.fluency.segment_metrics_list);
        for (var segment_metrics of mJson.speech_score.fluency.segment_metrics_list) {
            // const segment_metrics = 
            // console.log("segment", segment_metrics);
            var segment = segment_metrics["segment"];
            for (var word_id=0; word_id<segment[1] - segment[0]; word_id ++) {
                word_segment_pronunciation_scores.push(segment_metrics.speechace_score.pronunciation);
                word_segment_fluency_scores.push(segment_metrics.speechace_score.fluency);
                word_segment_grammar_scores.push(segment_metrics.speechace_score.grammar);
                word_segment_coherence_scores.push(segment_metrics.speechace_score.coherence);
                word_segment_vocab_scores.push(segment_metrics.speechace_score.vocab);
            }
        }

        return [
            word_segment_pronunciation_scores,
            word_segment_fluency_scores,
            word_segment_grammar_scores,
            word_segment_coherence_scores,
            word_segment_vocab_scores
        ];
    };
    score_lists = get_segment_list(response_json);
    // pronunciation_score_list = score_lists[0];
    // fluency_score_list = score_lists[1];
    // grammar_score_list = score_lists[2];
    // coherence_score_list = score_lists[3];
    // vocab_score_list = score_lists[4];

    // console.log(pauses_type_list);
    // console.log(pitches_type_list);
    // console.log(extents_type_list);

    const get_dimension_list = (mJson) => {
        var grammar_scores = [];
        var grammar_names = [];
        var vocab_scores = [];
        var vocab_names = [];
        var coherence_scores = [];
        var coherence_names = [];

        if(mJson?.speech_score?.grammar?.overall_metrics?.grammatical_range) {
            var grammar_metrics = mJson.speech_score.grammar.overall_metrics;

            grammar_scores.push(grammar_metrics.length.score);
            grammar_names.push("Length");
            
            grammar_scores.push(grammar_metrics.lexical_diversity.score);
            grammar_names.push("Lexical\nDiversity");

            grammar_scores.push(grammar_metrics.grammatical_accuracy.score);
            grammar_names.push("Grammatical\nAccuracy");

            grammar_scores.push(grammar_metrics.grammatical_range.noun_phrase_complexity.score);
            grammar_names.push("Noun Phrase\nComplexity");

            grammar_scores.push(grammar_metrics.grammatical_range.noun_phrase_variation.score);
            grammar_names.push("Noun Phrase\nVariation");

            grammar_scores.push(grammar_metrics.grammatical_range.verb_construction_variation.score);
            grammar_names.push("Verb\nConstruction\nVariation");

            grammar_scores.push(grammar_metrics.grammatical_range.adverb_modifier_variation.score);
            grammar_names.push("Adverb\nModifier\nVariation");

        }

        
        if(mJson?.speech_score?.vocab?.overall_metrics) {
            var vocab_metrics = mJson.speech_score.vocab.overall_metrics;
            
            vocab_scores.push(vocab_metrics.lexical_diversity.score);
            vocab_names.push("Lexical Diversity");
            
            vocab_scores.push(vocab_metrics.word_sophistication.score);
            vocab_names.push("Word\nSophistication");
            
            vocab_scores.push(vocab_metrics.word_specificity.score);
            vocab_names.push("Word\nSpecificity");
            
            vocab_scores.push(vocab_metrics.academic_language_use.score);
            vocab_names.push("Academic Language Use");
            
            vocab_scores.push(vocab_metrics.collocation_commonality.score);
            vocab_names.push("Collocation\nCommonality");
            
            vocab_scores.push(vocab_metrics.idiomaticity.score);
            vocab_names.push("Idiomaticity");
        }

        
        if(mJson?.speech_score?.coherence?.overall_metrics) {
            var coherence_metrics = mJson.speech_score.coherence.overall_metrics;
            
            coherence_scores.push(coherence_metrics.lexical_density.score);
            coherence_names.push("Lexical Density");
            
            coherence_scores.push(coherence_metrics.basic_connectives.score);
            coherence_names.push("Basic\nConnectives");
            
            coherence_scores.push(coherence_metrics.causal_connectives.score);
            coherence_names.push("Causal\nConnectives");
            
            coherence_scores.push(coherence_metrics.negative_connectives.score);
            coherence_names.push("Negative\nConnectives");
            
            coherence_scores.push(coherence_metrics.pronoun_density.score);
            coherence_names.push("Pronoun\nDensity");
            
            coherence_scores.push(coherence_metrics.adverb_diversity.score);
            coherence_names.push("Adverb\nDiversity");
            
            coherence_scores.push(coherence_metrics.verb_diversity.score);
            coherence_names.push("Verb\nDiversity");
        }


        return [grammar_scores, grammar_names,
                vocab_scores, vocab_names,
                coherence_scores, coherence_names];
    };

    const list_results_2 = get_dimension_list(response_json);
    const grammar_scores_list = list_results_2[0];
    const grammar_names_list = list_results_2[1];
    const vocab_scores_list = list_results_2[2];
    const vocab_names_list = list_results_2[3];
    const coherence_scores_list = list_results_2[4];
    const coherence_names_list = list_results_2[5];



    const handleSpanClick = (index) => {
        if (expandedItemIndex === index) {
            // console.log("click two");
            setExpandedItemIndex(null);
        } else {
            // console.log("click three");
            setExpandedItemIndex(index);
        }
    };

    const handleStressClick = () => {
        setShowStress(!show_stress);  // 切换布尔值
    };
    
    const handlePauseClick = () => {
        setShowPause(!show_pause);  // 切换布尔值
    };
    
    const handleSpeedClick = () => {
        setShowSpeed(!show_speed);  // 切换布尔值
    };

    const handleSubscoreClick = () => {
        console.log("current subscore", show_subscore+1);
        const subscoreBtn = document.getElementById("subscore_button");
        subscoreBtn.textContent = subscore_label_list[(show_subscore+1)%6];
        setShowSubscore((show_subscore+1) % 6);
    }

    const handleRadarClick = () => {     
        const radarBtn = document.getElementById("radar_button");
        radarBtn.textContent = radar_label_list[show_radar? 0:1];
        setShowRadar(!show_radar);
    }


    
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

    const spanElements = mColors.map((mColor, index) => {
        return <span style={{ backgroundColor: `rgba(${mColor[0]}, ${mColor[1]}, ${mColor[2]}, 0.6)`, color: "transparent" }}>___</span>; //{parseInt(index/mColors.length*100)}
    })
    

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
                <div className="voicing_control">
                    <button onClick={handlePauseClick}>Show Pause</button>                    
                    <button onClick={handleStressClick}>Show Stress</button>
                    <button onClick={handleSpeedClick}>Show Speed</button>
                    <button onClick={handleSubscoreClick} id="subscore_button">No Subscore</button>
                    <button onClick={handleRadarClick} id="radar_button">Show Details</button>
                </div>
                { (!show_radar) &&
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
                }  
                { (show_radar) &&
                    <div className="radar_chart_area">
                        <div className="radar_chart_container">
                            <p className="radar_chart_title">Grammar Details:</p>
                            <RadarChart className="radar_chart" id="grammar_radar" dataList={grammar_scores_list} nameList={grammar_names_list} title={"Grammar Details"} />
                        </div> 
                        <div className="radar_chart_container">
                            <p className="radar_chart_title">Vocab Details:</p>
                            <RadarChart className="radar_chart" id="vocab_radar" dataList={vocab_scores_list} nameList={vocab_names_list} title={"Vocabulary Details"} />                        
                        </div> 
                        <div className="radar_chart_container">
                            <p className="radar_chart_title">Coherence Details:</p>
                            <RadarChart className="radar_chart" id="coherence_radar" dataList={coherence_scores_list} nameList={coherence_names_list} title={"Coherence Details"} />
                        </div>                        
                    </div>
                }
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
                                    {/* <span className={(show_speed)? extents_type_list[index] : "correct"}>
                                        <span id={index.toString()} className={(show_stress)? pitches_type_list[index] : "correct"}> */}
                                            {/* className={correct_mark?
                                                // (item.quality_score > boundary)?
                                                ((expandedItemIndex === index)? "active_correct" : "correct") : 
                                                ((expandedItemIndex === index)? "active_incorrect" : "incorrect")} 
                                            onClick={() => handleSpanClick(index)}> */}
                                            {/* {item.word}
                                        </span>
                                        <span className={(show_pause)? pauses_type_list[index] : "correct"}>{item.ending_punctuation} </span>
                                    </span> */}
                                    <WordSpan show_speed={show_speed} show_stress={show_stress} show_pause={show_pause} show_subscore={show_subscore} index={index} word={item.word} punc={item.ending_punctuation} onclick={handleSpanClick}></WordSpan>
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
                
                
                {(show_subscore>0) && <div className="legend">
                    <span className="legend_num">0</span>
                    {spanElements}
                    <span className="legend_num">100</span>
                </div>}

                
                {(show_pause) && <div className="pause_annotation">
                    <div>
                        <input type="number" value={pause_bar1} id="brief_pause_control" step="0.1" onChange={handlePauseBar1}/>
                        <span className="brief_pause">brief pause</span>
                    </div>
                    <div>
                        <input type="number" value={pause_bar2} id="master_pause_control" step="0.1" onChange={handlePauseBar2}/>
                        <span className="master_pause">master pause</span>
                    </div>
                    <div>
                        <input type="number" value={pause_bar3} id="long_pause_control" step="0.1"  onChange={handlePauseBar3}/>
                        <span className="long_pause">long pause</span>
                    </div>
                </div>}
                
                {(show_stress) && <div className="stress_annotation">
                    <div>
                        <input type="number" value={stress_bar} id="stress_control" step="0.1" onChange={handleStressBar}/>
                        <span className="stress">stress</span>
                    </div>
                </div>}
                
                {(show_speed) && <div className="speed_annotation">
                    <div>
                        <input type="number" value={extent_bar_long} id="low_speed_control" step="0.1" onChange={handleExtentBarLong}/>
                        <span className="low_speed">low_speed</span>
                    </div>
                    <div>
                        <input type="number" value={extent_bar_short} id="high_speed_control" step="0.1" onChange={handleExtentBarShort}/>
                        <span className="high_speed">high_speed</span>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default PartFeedback;
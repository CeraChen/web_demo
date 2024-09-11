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
const EXTENT_SHORT_PERCENT = 20; // 15;
const EXTENT_LONG_PERCENT = 10; //8;
const SEGMENT_RATE_FAST = 3.0;
const SEGMENT_RATE_SLOW = 2.0;
const SKIP_WORDS = ["the", "a", "an", "I", "this", "that"];

const boundary = 70;

// var show_stress = false;
// var show_speed = true;
// var show_pause = true;
var pauses_type_list = [];
var pitches_type_list = [];
var extents_type_list = [];

var pause_count = [0, 0, 0];


// var pronunciation_score_list = [];
// var fluency_score_list = [];
// var grammar_score_list = [];
// var coherence_score_list = [];
// var vocab_score_list = [];

var score_lists = [];
var speed_rate_average = 0;
var speed_rate_sign = "unknown";

var pitch_vary_sign = "unknown";
var stress_sentence = "";

var max_score_sentences = [];
var min_score_sentences = [];
var max_sentence_scores = [];
var min_sentence_scores = [];
var all_segment_results = [];


const subscore_label_list = ["No Subscore", "Pronunciation", "Fluency", "Grammar", "Coherence", "Vocabulary"];
const radar_label_list = ["Show Details", "Show Scores"]

const MIDDLE_COLOR = [200, 200, 200];
const mColors = [
        [190,79,112], [200,111,137], [209,143,162], [219,174,188], [228,206,213], 
        [238,238,238],
        [202,223,205], [165,208,172], [129,192,138], [92,177,105], [56,162,72]  
    ];
// pink-green: [
//     [190,79,112], [200,111,137], [209,143,162], [219,174,188], [228,206,213], 
//     [238,238,238],
//     [202,223,205], [165,208,172], [129,192,138], [92,177,105], [56,162,72]  
// ]; 
// red-blue: [[21,3,251], [42,72,235], [52,116,235], [24,149,255], [1,184,255], [94,196,244], [168,218,242], [255,253,177], [255,228,63], [255,189,15], [255,144,0], [255,89,0], [255,5,0], [214,0,0]];


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


function VocabularyAspects({ mJson, mMaxSentences, mMinSentences, mMaxScores, mMinScores }) {
    var high_list = [];
    var medium_list = [];
    var low_list = [];
    console.log(mMaxSentences[4]);
    console.log(mMinSentences[4]);

    var max_color = [255, 255, 255];
    var min_color = [255, 255, 255];
    console.log(mMaxScores[4], mMinScores[4])
    if (mMaxScores.length == 5 && mMinScores.length == 5) {
        const max_color_idx = parseInt(mMaxScores[4]/100*mColors.length);
        max_color = [...mColors[max_color_idx]];
        if (max_color_idx == 5) {
            max_color = MIDDLE_COLOR;
        }
        
        const min_color_idx = parseInt(mMinScores[4]/100*mColors.length);
        min_color = [...mColors[min_color_idx]];
        if (min_color_idx == 5) {
            min_color = MIDDLE_COLOR;
        }
    }

    const get_appended_aspects = (mAspectList, mClassName) => {
        if (mAspectList.length == 1) {
            return <span>
                <span className={mClassName}>{mAspectList[0]}</span>.
            </span>;
        }

        else {
            return <span>
                {mAspectList.slice(0, mAspectList.length-1).map((aspect) => {
                    return <span><span className={mClassName}>{aspect}</span>, </span>;
                })} and <span className={mClassName}>{mAspectList[mAspectList.length-1]}</span>.
            </span>;
        }
    }

    if (mJson?.speech_score?.vocab?.overall_metrics) {
        const vocab_metrics = mJson.speech_score.vocab.overall_metrics;
        const vocab_item_names = ["lexical_diversity", "word_sophistication", "word_specificity", "academic_language_use", "collocation_commonality", "idiomaticity"];
        
        for (var item_idx=0; item_idx<vocab_item_names.length; item_idx++) {
            var item_name = vocab_item_names[item_idx];
            switch (vocab_metrics[item_name]["level"]) {
                case "high":
                    high_list.push(item_name.replace(/_/g, " "));
                    break;
                case "mid":
                    medium_list.push(item_name.replace(/_/g, " "));
                    break;
                case "low":
                    low_list.push(item_name.replace(/_/g, " "));
                    break;
                default:
                    console.log(vocab_metrics[item_name])
                    break;
            }
        }
    }
    
    return <div className="vocab_feedback">
        <ul>
            {(
                (mMaxSentences.length == 5) && 
                (mMinSentences.length == 5) && 
                (mMaxSentences[4] != mMinSentences[4])
            ) &&
                <li>You demonstrate the <span className="bold_span">best</span> vocabulary in sentence <span style={{ color: `rgb(${max_color[0]}, ${max_color[1]}, ${max_color[2]})`}}>{mMaxSentences[4]}</span>, while the <span className="bold_span">poorest</span> in  <span style={{ color: `rgb(${min_color[0]}, ${min_color[1]}, ${min_color[2]})`}}>{mMinSentences[4]}</span></li>
            }
                {/* <li>You demonstrate the <span className="bold_span">best</span> vocabulary in sentence <span className="best_sentence">{mMaxSentences[4]}</span>, while the <span className="bold_span">poorest</span> in  <span className="worst_sentence">{mMinSentences[4]}</span></li>
            } */}

            {(high_list.length > 0) && 
                <li>You demonstrate a <span className="bold_span">great</span> proficiency in {get_appended_aspects(high_list, "high_level_text")}</li>
            }
            {(medium_list.length > 0) && 
                <li>You have a <span className="bold_span">moderate</span> performance in {get_appended_aspects(medium_list, "medium_level_text")}</li>
            }
            {(low_list.length > 0) && 
                <li>You may <span className="bold_span">need improvement</span> in {get_appended_aspects(low_list, "low_level_text")}</li>
            }
        </ul>
    </div>
}


function GrammarAspects({ mJson, mMaxSentences, mMinSentences, mMaxScores, mMinScores }) {
    var high_list = [];
    var medium_list = [];
    var low_list = [];
    // console.log(mMaxSentences[2]);
    // console.log(mMinSentences[2]);

    var max_color = [255, 255, 255];
    var min_color = [255, 255, 255];
    if (mMaxScores.length == 5 && mMinScores.length == 5) {
        const max_color_idx = parseInt(mMaxScores[2]/100*mColors.length);
        max_color = [...mColors[max_color_idx]]; 
        if (max_color_idx == 5) {
            max_color = MIDDLE_COLOR;
        }
        
        const min_color_idx = parseInt(mMinScores[2]/100*mColors.length);
        min_color = [...mColors[min_color_idx]];
        if (min_color_idx == 5) {
            min_color = MIDDLE_COLOR;
        }
    }

    const get_appended_aspects = (mAspectList, mClassName) => {
        if (mAspectList.length == 1) {
            return <span>
                <span className={mClassName}>{mAspectList[0]}</span>.
            </span>;
        }

        else {
            return <span>
                {mAspectList.slice(0, mAspectList.length-1).map((aspect) => {
                    return <span><span className={mClassName}>{aspect}</span>, </span>;
                })} and <span className={mClassName}>{mAspectList[mAspectList.length-1]}</span>.
            </span>;
        }
    }

    if (mJson?.speech_score?.grammar?.overall_metrics) {
        const metrics = mJson.speech_score.grammar.overall_metrics;
        const item_names = ["length", "lexical_diversity", "grammatical_accuracy", "noun_phrase_complexity", "noun_phrase_variation", "verb_construction_variation", "adverb_modifier_variation"];
        
        for (var item_idx=0; item_idx<item_names.length; item_idx++) {
            var item_name = item_names[item_idx];
            var current_level = (item_idx<3)? metrics[item_name]["level"] : metrics["grammatical_range"][item_name]["level"];
            switch (current_level) {
                case "high":
                    high_list.push(item_name.replace(/_/g, " "));
                    break;
                case "mid":
                    medium_list.push(item_name.replace(/_/g, " "));
                    break;
                case "low":
                    low_list.push(item_name.replace(/_/g, " "));
                    break;
                default:
                    break;
            }
        }
    }
    
    return <div className="grammar_feedback">
        <ul>
            {(
                (mMaxSentences.length == 5) && 
                (mMinSentences.length == 5) && 
                (mMaxSentences[2] != mMinSentences[2])
            ) &&
                <li>You demonstrate the <span className="bold_span">best</span> grammar in sentence <span style={{ color: `rgb(${max_color[0]}, ${max_color[1]}, ${max_color[2]})`}}>{mMaxSentences[2]}</span>, while the <span className="bold_span">poorest</span> in  <span style={{ color: `rgb(${min_color[0]}, ${min_color[1]}, ${min_color[2]})`}}>{mMinSentences[2]}</span></li>
            }

            {(high_list.length > 0) && 
                <li>You demonstrate a <span className="bold_span">great</span> proficiency in {get_appended_aspects(high_list, "high_level_text")}</li>
            }
            {(medium_list.length > 0) && 
                <li>You have a <span className="bold_span">moderate</span> performance in {get_appended_aspects(medium_list, "medium_level_text")}</li>
            }
            {(low_list.length > 0) && 
                <li>You may <span className="bold_span">need improvement</span> in {get_appended_aspects(low_list, "low_level_text")}</li>
            }
        </ul>
    </div>
}


function IntonationSpan({ into, idx }) {
    // const FALL_COLOR = [75, 164, 253];
    // const RISE_COLOR = [0, 206, 209];
    // const FLAT_COLOR = [230, 230, 250];
    
    const FALL_COLOR = [109, 178, 247];
    const RISE_COLOR = [242, 196, 32];
    const FLAT_COLOR = [171, 171, 186];
    
    var cur_color = [255, 255, 255];
    
    var result = "";
    switch (into) {
        case "FALL":
            result = "↓";
            cur_color = FALL_COLOR;
            break;

        case "RISE":
            result = "↑";
            cur_color = RISE_COLOR;
            break;

        case "FLAT":
            result = "-";
            cur_color = FLAT_COLOR;
            break;

        default:
            break;
    }
        
    // if (result.length > 0) {
    //     result = " " + result;
    // }
    
    return <span style={{ color: `rgb(${cur_color[0]}, ${cur_color[1]}, ${cur_color[2]})`}}>{result}</span>;
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
        // console.log("subscore", score_list[index])
        // mColor[0] *= (Math.pow(score_list[index], 2)/10000);
        // mColor[1] *= (Math.pow(score_list[index], 2)/10000);
        // mColor[2] *= (Math.pow(score_list[index], 2)/10000);
        for (var i=0; i<3; i++) {
            mColor[i] = mColors[color_idx][i];
            // (mColors[0][i] * score_list[index]/100) + (mColors[1][i] * (1-score_list[index]/100));
        }
        mColor[3] = 0.6;
        // console.log(mColor);
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

        var pause_count_list = [0, 0, 0];

        if (!mJson?.speech_score?.word_score_list) {
            console.log("no score!!!");
            return [pause_list, pitch_list, extent_list, "", 0, [0, 0, 0]];
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
                        pause_count_list[0] += 1;
                    }
                    else {
                        if (interval < pause_bar3) {
                            interval_type = "master_pause"; // master pause
                            pause_count_list[1] += 1;
                        }
                        else {
                            interval_type = "long_pause"; // long pause
                            pause_count_list[2] += 1;
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

        const current_segment_list = mJson?.speech_score?.fluency?.segment_metrics_list;
        var current_word_idx = 0;
        var max_sd = 0;
        var max_start = 0;
        var max_end = 0;
        var pitch_sd_mean = 0;
        for (var segment_idx=0; segment_idx<current_segment_list.length; segment_idx ++) {
            var current_word_count = current_segment_list[segment_idx]["word_count"]; 
            var current_segment_sd = word_sd_pitches.slice(current_word_idx, current_word_idx+current_word_count);
            
            var current_segment_sd_mean = current_segment_sd.reduce((accumulator, currentValue) => accumulator + currentValue);
            pitch_sd_mean += current_segment_sd_mean;
            current_segment_sd_mean /= current_word_count;
            
            if (current_segment_sd_mean > max_sd) {
                max_sd = current_segment_sd_mean;
                max_start = current_word_idx;
                max_end = current_word_idx + current_word_count;
            }
            current_word_idx += current_word_count;
        }
        if (word_sd_pitches.length > 0) {
            pitch_sd_mean /= word_sd_pitches.length;
        }
         

        var max_sd_sentence = "\"";
        console.log("MAX START", max_start);
        console.log("MAX END", max_end);
        if (max_start < max_end) {
            var max_sd_words = mJson["speech_score"]["word_score_list"].slice(max_start, max_end);
            for (var sd_word_idx=0; sd_word_idx<max_sd_words.length; sd_word_idx ++) {
                console.log("word", max_sd_words[sd_word_idx].word)
                max_sd_sentence += (((sd_word_idx > 0)? " " : "") + max_sd_words[sd_word_idx].word);
                // if (max_sd_words[sd_word_idx].ending_punctuation) {
                //     max_sd_sentence += max_sd_words[sd_word_idx].ending_punctuation;
                // }
            }
        }
        max_sd_sentence += "\"";


        
        return [pause_list, pitch_list, extent_list, max_sd_sentence, pitch_sd_mean, pause_count_list];
    };    
    const list_results = get_voicing_list(response_json);
    pauses_type_list = list_results[0];
    pitches_type_list = list_results[1];
    extents_type_list = list_results[2];
    stress_sentence = list_results[3];
    var pitch_sd_mean = list_results[4];
    pitch_vary_sign = (pitch_sd_mean > stress_bar/2.5)? "changable" : "stable";

    pause_count = list_results[5];

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
                word_segment_vocab_scores,
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                [],
                []
            ];
        } 
        
        // var speech_rate = [];
        // var word_count = [];
        // console.log("mJson.speech_score.fluency.segment_metrics_list", mJson.speech_score.fluency.segment_metrics_list);
        var max_scores = [0, 0, 0, 0, 0]; // pronunciation, fluency, grammar, coherence, vocab
        var min_scores = [100, 100, 100, 100, 100];
        var max_segment_two_idx = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        var min_segment_two_idx = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        
        const update_max_min = (current_scores, two_idx) => {
            for (var score_idx=0; score_idx<current_scores.length; score_idx++) {
                if (current_scores[score_idx] > max_scores[score_idx]) {
                    max_scores[score_idx] = current_scores[score_idx];
                    max_segment_two_idx[score_idx] = two_idx;
                }

                if (current_scores[score_idx] < min_scores[score_idx]) {
                    min_scores[score_idx] = current_scores[score_idx];
                    min_segment_two_idx[score_idx] = two_idx;
                }

            }
        };

        for (var segment_metrics of mJson.speech_score.fluency.segment_metrics_list) {
            // const segment_metrics = 
            // console.log("segment", segment_metrics);
            var segment = segment_metrics["segment"];
            // speech_rate.push(segment_metrics["speech_rate"]);
            // word_count.push(segment_metrics["word_count"]);
            update_max_min(
                [
                    segment_metrics.speechace_score.pronunciation, 
                    segment_metrics.speechace_score.fluency, 
                    segment_metrics.speechace_score.grammar, 
                    segment_metrics.speechace_score.coherence, 
                    segment_metrics.speechace_score.vocab
                ], 
                [segment[0], segment[1]]
            );
            for (var word_id=0; word_id<segment[1] - segment[0]; word_id ++) {
                word_segment_pronunciation_scores.push(segment_metrics.speechace_score.pronunciation);
                word_segment_fluency_scores.push(segment_metrics.speechace_score.fluency);
                word_segment_grammar_scores.push(segment_metrics.speechace_score.grammar);
                word_segment_coherence_scores.push(segment_metrics.speechace_score.coherence);
                word_segment_vocab_scores.push(segment_metrics.speechace_score.vocab);
            }
        }

        var max_sentences = ["", "", "", "", ""];
        var min_sentences = ["", "", "", "", ""];
        const word_list = mJson.speech_score?.word_score_list;
        
        for (var score_idx=0; score_idx<max_segment_two_idx.length; score_idx++) {
            var current_sentence = "\"";
            for (var word_idx=max_segment_two_idx[score_idx][0]; word_idx<max_segment_two_idx[score_idx][1]; word_idx ++) {
                current_sentence += (((word_idx > max_segment_two_idx[score_idx][0])? " " : "") + word_list[word_idx].word);
                
                if (word_idx != (max_segment_two_idx[score_idx][1]-1) && word_list[word_idx].ending_punctuation) {
                    current_sentence += word_list[word_idx].ending_punctuation;
                }
            }
            current_sentence += "\"";
            max_sentences[score_idx] = current_sentence;
        }
        
        for (var score_idx=0; score_idx<min_segment_two_idx.length; score_idx++) {
            var current_sentence = "\"";
            for (var word_idx=min_segment_two_idx[score_idx][0]; word_idx<min_segment_two_idx[score_idx][1]; word_idx ++) {
                current_sentence += (((word_idx > min_segment_two_idx[score_idx][0])? " " : "") + word_list[word_idx].word);
                
                if (word_idx != (min_segment_two_idx[score_idx][1]-1) && word_list[word_idx].ending_punctuation) {
                    current_sentence += word_list[word_idx].ending_punctuation;
                }
            }
            current_sentence += "\"";
            min_sentences[score_idx] = current_sentence;
        }
        
        // var speed_rate_mean = 0;
        // if (speech_rate.length > 0) {            
        //     for (var segment_idx=0; segment_idx<speech_rate.length; segment_idx ++) {
        //         speed_rate_mean += (speech_rate[segment_idx] * word_count[segment_idx]);
        //     }
        //     speed_rate_mean /= speech_rate.length;
        // }

        return [
            word_segment_pronunciation_scores,
            word_segment_fluency_scores,
            word_segment_grammar_scores,
            word_segment_coherence_scores,
            word_segment_vocab_scores,
            max_sentences,
            min_sentences,
            max_scores,
            min_scores
        ];
    };
    // segment_results = get_segment_list(response_json);
    // score_lists = segment_results[0];
    // speed_rate_average = segment_results[1];
    
    all_segment_results = get_segment_list(response_json);
    console.log(all_segment_results);
    score_lists = all_segment_results.slice(0, 5);
    speed_rate_average = response_json?.speech_score?.fluency?.overall_metrics?.speech_rate;
    speed_rate_sign = (speed_rate_average > SEGMENT_RATE_FAST)? "fast" : ((speed_rate_average < SEGMENT_RATE_SLOW)? "slow" : "moderate");

    max_score_sentences = all_segment_results[5];
    min_score_sentences = all_segment_results[6];

    max_sentence_scores = all_segment_results[7];
    min_sentence_scores = all_segment_results[8];
    // console.log("MAX SCORES", max_score_sentences);
    // console.log("MIN SCORES", min_score_sentences);
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



    
    // const get_vocab_report = (mJson) => {
    //     if (mJson?.speech_score?.vocab?.overall_metrics) {
    //         const vocab_metrics = mJson.speech_score.vocab.overall_metrics;
    //         const vocab_item_names = ["lexical_diversity", "word_sophistication", "word_specificity", "academic_language_use", "collocation_commonality", "idiomaticity"];
            
    //         var high_list = [];
    //         var medium_list = [];
    //         var low_list = [];

    //         for (var item_idx=0; item_idx<vocab_item_names.length; item_idx++) {
    //             var item_name = vocab_item_names[item_idx];
    //             switch (vocab_metrics[item_name]["level"]) {
    //                 case "high":
    //                     high_list.push(item_name.replace(/_/g, " "));
    //                     break;
    //                 case "mid":
    //                     medium_list.push(item_name.replace(/_/g, " "));
    //                     break;
    //                 case "low":
    //                     low_list.push(item_name.replace(/_/g, " "));
    //                     break;
    //                 default:
    //                     console.log(vocab_metrics[item_name])
    //                     break;
    //             }
    //         }

    //         const get_appended_aspects = (mAspectList) => {
    //             var output = "";
    //             if (mAspectList.length == 1) {
    //                 output += mAspectList[0];
    //             }
    //             else {
    //                 for (var aspect_idx=0; aspect_idx<(mAspectList.length-1); aspect_idx ++) {
    //                     output += mAspectList[aspect_idx];
    //                     output += ", ";
    //                 }
    //                 output += "and ";
    //                 output += mAspectList[mAspectList.length - 1];
    //             }
    //             output += ". ";
    //             return output;
    //         }

    //         var result = "";
    //         if (high_list.length > 0) {
    //             result += "You demonstrate a great proficiency in ";
    //             result += get_appended_aspects(high_list);
    //         }

    //         if (medium_list.length > 0) {
    //             result += "You have a moderate performance in ";
    //             result += get_appended_aspects(medium_list);
    //         }
            
    //         if (low_list.length > 0) {
    //             result += "You may need improvement in ";
    //             result += get_appended_aspects(low_list);
    //         }

    //         return result;            
    //     }
        
    //     return "";

    // };

    // mVocabReport = get_vocab_report(response_json);



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
    });
    

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
                            var intonations = new Array(item.phone_score_list.length).fill([]);
                            
                            var last_pos = 0;
                            // const get_intonation = (mIntonation) => {
                            //     var result = "";
                            //     for (var into_idx=0; into_idx<mIntonation.length; into_idx ++) {
                            //         switch (mIntonation[into_idx]) {
                            //             case "FALL":
                            //                 result += "↓";
                            //                 break;
                            //             case "RISE":
                            //                 result += "↑";
                            //                 break;
                            //             case "FLAT":
                            //                 result += "-";
                            //                 break;
                            //             default:
                            //                 break;
                            //         }
                                    
                            //     }
                            //     if (result.length > 0) {
                            //         result = " " + result;
                            //     }
                            //     return result;
                            // };
                            // for(var syllable of item.syllable_score_list) {
                            for (var syllable_idx=0; syllable_idx<item.syllable_score_list.length; syllable_idx++) {
                                var syllable = item.syllable_score_list[syllable_idx];
                                syllable_marks[last_pos] = syllable.phone_count;
                                syllables[last_pos] = syllable.letters;
                                intonations[last_pos] = response_json?.speech_score?.word_intonation_list[index].syllable_intonation_list[syllable_idx];
                                // get_intonation(response_json?.speech_score?.word_intonation_list[index].syllable_intonation_list[syllable_idx]);
                                // console.log(intonations);
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
                                                        {/* <th>Intonation</th> */}
                                                        <th>Syllable</th>
                                                        <th>Phone</th>
                                                        <th>Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.phone_score_list.map((phone, idx) => (
                                                        <tr>
                                                            {/* {(syllable_marks[idx] > 0) && (<td rowSpan={syllable_marks[idx]}>{intonations[idx]}</td>)} */}
                                                            {(syllable_marks[idx] > 0) && (<td rowSpan={syllable_marks[idx]}>{syllables[idx]}{intonations[idx].map((into, into_idx) => {return <IntonationSpan into={into} idx={into_idx}/>})}</td>)}
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

                <p className="report_title">Voicing report:</p>
                <ul>
                    <li className="pace_feedback">Your overall <span className="bold_span">pace</span> is <span className="speed_text">{speed_rate_sign}</span>, with <span className="speed_number">{parseInt(response_json?.speech_score?.fluency?.overall_metrics?.word_correct_per_minute)}</span> correct words count per minute.</li>

                    <li className="speed_feedback">Your <span className="bold_span">pitch</span> is <span className="stress_label">{pitch_vary_sign}</span>, presenting the most varied tone in sentence <span className="stress_sentence">{stress_sentence}</span>.</li>
                    
                    {((pause_count[0] == 0) && (pause_count[1] == 0) && (pause_count[2] == 0)) &&
                        <li className="pause_feedback">You did not make any <span className="bold_span">brief</span>, <span className="bold_span">master</span>, or <span className="bold_span">long</span> pause. You may learn to modulate your speech by making approapriate pauses.</li>
                    }
                    {((pause_count[0] > 0) || (pause_count[1] > 0) || (pause_count[2] > 0)) &&
                        <li className="pause_feedback">You made <span className="brief_pause_text">{pause_count[0]}</span> <span className="bold_span">brief</span> {(pause_count[0]>1)? "pauses":"pause"}, <span className="master_pause_text">{pause_count[1]}</span> <span className="bold_span">master</span> {(pause_count[1]>1)? "pauses":"pause"}, and <span className="long_pause_text">{pause_count[2]}</span> <span className="bold_span">long</span> {(pause_count[2]>1)? "pauses":"pause"}.</li>
                    }
                </ul>
                
                <p className="report_title">Grammar report:</p>
                <GrammarAspects mJson={response_json} mMaxSentences={max_score_sentences} mMinSentences={min_score_sentences} mMaxScores={max_sentence_scores} mMinScores={min_sentence_scores}/>

                
                <p className="report_title">Vocabulary report:</p>
                <VocabularyAspects mJson={response_json} mMaxSentences={max_score_sentences} mMinSentences={min_score_sentences} mMaxScores={max_sentence_scores} mMinScores={min_sentence_scores}/>

                
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
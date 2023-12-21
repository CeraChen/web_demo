import './css/App.css';
import { Route, Routes } from 'react-router-dom';
import EntryPage from './page/entry';
import CheckPage from './page/check';
import StartPage from './page/start';
import Intro from './page/introduction';
import MockTest from './page/mocktest';
import Report from './page/report';
import React, { useState } from 'react';

// import MockTest_ from './page/mocktest_';

const PART_A = 0;
const PART_B = 1;
const Q_NUM = 1;
    

function App() {
    var partAUrl = '';
    var partBUrl = '';

    const updateUrl = (part, newUrl) => {
        switch(part) {
            case PART_A:
                partAUrl = newUrl;
                break;
            case PART_B:
                partBUrl = newUrl;
                break;
        }
    };

    const getUrl = (part) => {
        switch(part) {
            case PART_A:
                return partAUrl;
            case PART_B:
                return partBUrl;
            default:
                return null;
        }
    };

    var q_num = Math.floor(Math.random() * Q_NUM) + 1;
    return (
        <Routes>
            <Route  path='/' element = {<EntryPage />} />
            <Route  path='/check' element = {<CheckPage />} />
            <Route  path='/start' element = {<StartPage />} />

            <Route  path='/partA/introduction' element = {<Intro part={PART_A} q_num={q_num}/>} />
            <Route  path='/partA/mocktest' element = {<MockTest part={PART_A} q_num={q_num} update_url={updateUrl}/>} />

            <Route  path='/partB/introduction' element = {<Intro part={PART_B} q_num={q_num}/>} />
            <Route  path='/partB/mocktest' element = {<MockTest part={PART_B} q_num={q_num} update_url={updateUrl}/>} />

            <Route  path='/report' element = {<Report q_num={q_num} get_url={getUrl}/>} />
        </Routes>
    );
}

export default App;

import './css/App.css';
import { Route, Routes } from 'react-router-dom';
import EntryPage from './page/entry';
import InfoPage from './page/info';
import CheckPage from './page/check';
import StartPage from './page/start';
import Intro from './page/introduction';
import MockTest from './page/mocktest';
import Report from './page/report';
import React from 'react';

import Feedback from './page/feedback';

const PART_A = 0;
const PART_B = 1;

    

function App() {
    // var q_num = 2; //Math.floor(Math.random() * Q_NUM) + 1;

    return (
        <Routes>
            <Route  path='/' element = {<EntryPage />} />
            <Route  path='/info' element = {<InfoPage />} />
            <Route  path='/check' element = {<CheckPage />} />
            <Route  path='/start' element = {<StartPage />} />

            <Route  path='/partA/introduction' element = {<Intro part={PART_A}/>} />
            <Route  path='/partA/mocktest' element = {<MockTest part={PART_A}/>} />

            <Route  path='/partB/introduction' element = {<Intro part={PART_B}/>} />
            <Route  path='/partB/mocktest' element = {<MockTest part={PART_B}/>} />

            <Route path='/report' element= {<Report/>} />
            
            <Route path='/feedback' element= {<Feedback/>} />
        </Routes>
    );
}

export default App;

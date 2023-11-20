import './css/App.css';
import { Route,Routes } from 'react-router-dom';
import EntryPage from './page/entry';
import MockTest from './page/mocktest';

let PART_A = 0;
let PART_B = 1;
let Q_NUM = 1;
    

function App() {
  // var current_part = PART_B;
  // var Mocktest = (
  //   <div>
  //       <Question part={current_part} q_num={Q_NUM}/>
  //       <RecordBtn part={current_part}/>
  //   </div>
  // );

  return (
    <Routes>
      <Route  path='/' element = {<EntryPage />} />
      <Route  path='/mocktest/:part' element = {<MockTest />} />
    </Routes>
  );
}

export default App;

import logo from './logo.svg';
import './css/App.css';
import RecordBtn from './recordBtn';
import Question from './question';

let PART_A = 0;
let PART_B = 1;
let Q_NUM = 1;

function App() {
  var current_part = PART_B;
  return (
    <div className="App">
      <Question part={current_part} q_num={Q_NUM}/>
      <RecordBtn part={current_part}/>
    </div>
  );
}

export default App;

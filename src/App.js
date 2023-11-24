import './css/App.css';
import { Route,Routes } from 'react-router-dom';
import EntryPage from './page/entry';
import MockTest from './page/mocktest';

let PART_A = 0;
let PART_B = 1;
let Q_NUM = 1;
    

function App() {
  return (
    <Routes>
      <Route  path='/' element = {<EntryPage />} />
      <Route  path='/mocktest/:part' element = {<MockTest />} />
    </Routes>
  );
}

export default App;

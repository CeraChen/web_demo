import logo from './logo.svg';
import './css/App.css';
import RecordBtn from './recordBtn';
import Question from './question';

function App() {
  return (
    <div className="App">
      <Question/>
      <RecordBtn/>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;

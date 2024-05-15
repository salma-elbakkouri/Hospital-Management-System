import logo from './logo.svg';
import './components/css/userInterface.css';
import './App.css';
// import Form from './components/form';
import  WaitingRoom from './components/user-interface';
import  Form from './components/form';

function App() {
  return (
    <div className="App">
      <Form />
     {/* <WaitingRoom/> */}
    </div>
  );
}

export default App;

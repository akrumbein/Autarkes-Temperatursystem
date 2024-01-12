import logo from './logo.svg';
import './App.css';
import Home from './roots/Home';
import { useState } from 'react';
import Rooms from './roots/Rooms';
import Settings from './roots/Settings';
import Export from './roots/Export';

function App() {

  const [root, setRoot] = useState(0)
  function click (site) {
    setRoot(site);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}

        <div style={{display: "flex", backgroundColor: "red", width: "100%"}}>  
          <div style={{display: "flex", margin: "60px", backgroundColor: "blue"}}>
            <button onClick={() => click(0)} style={{marginRight: "20px"}}>Home</button>
            <button onClick={() => click(1)} style={{marginRight: "20px"}}>Rooms</button>
            <button onClick={() => click(2)} style={{marginRight: "20px"}}>Settings</button>
            <button onClick={() => click(3)}>Export</button>
          </div> 
        </div>

        <div style={{backgroundColor: "green",width: "100%"}}>
         
        </div>
        
        {root == 0 && <Home/>}
        {root == 1 && <Rooms/>}
        {root == 2 && <Settings/>}
        {root == 3 && <Export/>}
      </header>
    </div>
  );
}

export default App;

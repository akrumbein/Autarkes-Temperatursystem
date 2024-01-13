import "./App.css";
import Home from "./routes/Home";
import { useState } from "react";
import Rooms from "./routes/Rooms";
import Settings from "./routes/Settings";
import Export from "./routes/Export";
import HeaderButtons from "./components/HeaderButtons";

function App() {
  const [route, setRoute] = useState(0);

  return (
    <div style={{backgroundColor:"#98a4ab", width:"100%", height:"100%"}}>
    <div style={{
      display: "flex",
          paddingTop: "5%",
          paddingLeft: "5%",
          flexDirection:"column",
          gap:20,
          width:"90vw",
          height:"100vw"
    }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          maxWidth: 500,
          justifyContent: "space-between",
        }}
      >
        {["Home", "Rooms", "Settings", "Export"].map((ele, number) => {
          return <HeaderButtons label={ele} onClick={() => setRoute(number)} />;
        })}
      </div>

      {route == 0 && <Home />}
      {route == 1 && <Rooms />}
      {route == 2 && <Settings />}
      {route == 3 && <Export />}
    </div>
    </div>
  );
}

export default App;

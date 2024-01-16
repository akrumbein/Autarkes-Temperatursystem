import "./App.css";
import Home from "./routes/Home";
import { useEffect, useState } from "react";
import Rooms from "./routes/Rooms";
import Settings from "./routes/Settings";
import Export from "./routes/Export";
import HeaderButtons from "./components/HeaderButtons";
import RoomsSelection from "./components/RoomsSelection";

function App() {
  const [route, setRoute] = useState(0);
  const [choosenRoom, setChoosenRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentActiveRoom, setCurrentActiveRoom] = useState("");
  const [measurements, setMeasurements] = useState([]);

  const setActiveRoom = () => {
    fetch(`http://localhost:6969/setCurrentActive?roomName=${choosenRoom}`)
      .then((response) => response.json())
      .then((response) => {
        setCurrentActiveRoom(response.currentActiveRoom);
      });
  };

  useEffect(() => {
    fetch("http://localhost:6969/getAvailableRooms")
      .then((response) => response.json())
      .then((response) => {
        setAvailableRooms(response.rooms.map((ele) => ele.name));
        setCurrentActiveRoom(response.currentActiveRoom);
        setChoosenRoom(response.currentActiveRoom);
      });
  }, []);

  useEffect(() => {
    if (!choosenRoom) return;
    fetch(`http://localhost:6969/getMeasurements?roomName=${choosenRoom}`)
      .then((response) => response.json())
      .then((response) => setMeasurements(response.measurements));

    const interval = setInterval(() => {
      fetch(`http://localhost:6969/getMeasurements?roomName=${choosenRoom}`)
        .then((response) => response.json())
        .then((response) => setMeasurements(response.measurements));
    }, 1000);
    return () => clearInterval(interval);
  }, [choosenRoom]);

  return (
    <div style={{ backgroundColor: "#98a4ab", width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          paddingTop: "5%",
          paddingLeft: "5%",
          flexDirection: "column",
          gap: 20,
          width: "90vw",
          height: "100vw",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            maxWidth: 500,
            justifyContent: "space-between",
          }}
        >
          {["Home", "Räume", "Einstellung", "Export"].map((ele, number) => {
            return (
              <HeaderButtons label={ele} onClick={() => setRoute(number)} />
            );
          })}
        </div>
        {availableRooms.length == 0 ? (
          <h1>Es existieren noch keine Räume bitte erstellen sie einen!</h1>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <RoomsSelection
              choosenRoom={choosenRoom}
              setChoosenRoom={setChoosenRoom}
              availableRooms={availableRooms}
              currentActiveRoom={currentActiveRoom}
            />
            {choosenRoom != currentActiveRoom && (
              <HeaderButtons
                label={"Als aktiven Raum setzen"}
                onClick={setActiveRoom}
              />
            )}
          </div>
        )}

        {route == 0 && <Home
         currentActiveRoom={currentActiveRoom}
         />}
        {route == 1 && (
          <Rooms
            availableRooms={availableRooms}
            setAvailableRooms={setAvailableRooms}
            setCurrentActiveRoom={setCurrentActiveRoom}
            setChoosenRoom={setChoosenRoom}
            choosenRoom={choosenRoom}
            measurements={measurements}
          />
        )}
        {route == 2 && <Settings />}
        {route == 3 && <Export />}
      </div>
    </div>
  );
}

export default App;

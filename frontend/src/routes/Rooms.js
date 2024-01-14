import { useEffect, useState } from "react";
import HeaderButtons from "../components/HeaderButtons";
import RoomsSelection from "../components/RoomsSelection";
import Table from "../components/Table";

const TimeParser = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds} ${day < 10 ? "0" + day : day}.${
    month < 10 ? "0" + month : month
  }.${year}`;
};

function Rooms() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentActiveRoom, setCurrentActiveRoom] = useState("");
  const [tryToCreateRoom, setTryToCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const [choosenRoom, setChoosenRoom] = useState("");
  const [measurements, setMeasurements] = useState([]);

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

  const createNewRoom = () => {
    if (!tryToCreateRoom) {
      setTryToCreateRoom(true);
      return;
    }
    if (!newRoomName || availableRooms.find((ele) => ele == newRoomName))
      return;

    fetch(`http://localhost:6969/addRoom?name=${newRoomName}`)
      .then((response) => response.json())
      .then((response) => {
        setAvailableRooms(response.rooms.map((ele) => ele.name));
        setCurrentActiveRoom(response.currentActiveRoom);
        setTryToCreateRoom(false);
        setChoosenRoom(newRoomName);
      });
  };

  const setActiveRoom = () => {
    fetch(`http://localhost:6969/setCurrentActive?roomName=${choosenRoom}`)
      .then((response) => response.json())
      .then((response) => {
        setCurrentActiveRoom(response.currentActiveRoom);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
      {choosenRoom && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>Gemessene Werte</h1>
            <h1>test</h1>
          </div>
          {measurements.map((ele) => (
            <Table
              key={ele.timestamp}
              title={TimeParser(ele.timestamp)}
              values={[ele.carbon + " ppm", <div>{ele.temp}℃</div>]}
            />
          ))}
        </>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {tryToCreateRoom && (
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{ borderRadius: 5 }}
            placeholder="Raumbezeichner"
          />
        )}
        <HeaderButtons
          label={tryToCreateRoom ? "Raum erstellen" : "Neuer Raum"}
          onClick={createNewRoom}
        />
      </div>
    </div>
  );
}

export default Rooms;

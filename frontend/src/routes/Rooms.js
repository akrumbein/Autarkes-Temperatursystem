import { useEffect, useState } from "react";
import HeaderButtons from "../components/HeaderButtons";
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

function Rooms({availableRooms, setAvailableRooms, setCurrentActiveRoom, setChoosenRoom, choosenRoom, currentActiveRoom, token}) {
  const [measurements, setMeasurements] = useState([]);
  const [tryToCreateRoom, setTryToCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const createNewRoom = () => {
    if (!tryToCreateRoom) {
      setTryToCreateRoom(true);
      return;
    }
    if (!newRoomName || availableRooms.find((ele) => ele == newRoomName))
      return;

    fetch(`http://${window.location.host.split(":")[0]}:6969/addRoom?name=${newRoomName}&token=${token}`)
      .then((response) => response.json())
      .then((response) => {
        setAvailableRooms(response.rooms.map((ele) => ele.name));
        setCurrentActiveRoom(response.currentActiveRoom);
        setTryToCreateRoom(false);
        setChoosenRoom(newRoomName);
      });
  };

  useEffect(() => {
    if (!choosenRoom) return;
    fetch(`http://${window.location.host.split(":")[0]}:6969/getMeasurements?roomName=${choosenRoom}&token=${token}`)
      .then((response) => response.json())
      .then((response) => setMeasurements(response.measurements));

    const interval = setInterval(() => {
      fetch(`http://${window.location.host.split(":")[0]}:6969/getMeasurements?roomName=${choosenRoom}&token=${token}`)
        .then((response) => response.json())
        .then((response) => setMeasurements(response.measurements));
    }, 60000);
    return () => clearInterval(interval);
  }, [choosenRoom, currentActiveRoom]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
    </div>
  );
}

export default Rooms;

import { useEffect, useState } from "react";
import Table from "../components/Table";

function Home() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRooms, setAvailableRoom] = useState([]);
  const [currentActiveRoom, setCurrentActiveRoom] = useState("54");

  useEffect(() => {
    fetch("http://localhost:6969/getAvailableRooms")
      .then((answer) => answer.json())
      .then((response) => {
        setCurrentActiveRoom(response.currentActiveRoom);
        setAvailableRoom(response.rooms.map((ele) => ele.name));
      });
  }, []);

  useEffect(() => {
    if (currentActiveRoom == null) return;
    fetch(`http://localhost:6969/getRoomInfo?name=${currentActiveRoom}`)
      .then((answer) => answer.json())
      .then((response) => {
        console.log(response.room);
        setSelectedRoom(response.room);
      });
  }, [currentActiveRoom]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {selectedRoom && (
        <>
          <div style={{ fontSize: 17, fontWeight: 500, color: "white" }}>
            <>Raum: </>
            <select
              onChange={(e) => {}}
              style={{
                width: "fit-content",
                fontSize: 17,
                fontWeight: 500,
                marginLeft: 10,
                padding: 5,
                borderRadius: 10,
              }}
            >
              {availableRooms.map((ele) => (
                <option value={ele} key={ele}>
                  {ele} {ele == currentActiveRoom && "(aktiv)"}
                </option>
              ))}
            </select>
          </div>
          <Table
            title={"Temperatur"}
            values={[
              <h5>"current Temperatur ℃"</h5>,
              <h5>
                "min: " + selectedRoom.minTemp .toFixed(1) .toString()
                .replaceAll(".", ",") + "℃"
              </h5>,
              <h5>
                "max: " + selectedRoom.maxTemp .toFixed(1) .toString()
                .replaceAll(".", ",") + "℃"
              </h5>,
            ]}
          />
          <Table
            title={"Co2 Gehalt"}
            values={[
              <h5>selectedRoom.currentCarbon + "ppm"</h5>,
              <h5>"min: " + selectedRoom.minCarbon + "ppm"</h5>,
              <h5>"max: " + selectedRoom.maxCarbon + "ppm"</h5>,
            ]}
          />
        </>
      )}
    </div>
  );
}

export default Home;

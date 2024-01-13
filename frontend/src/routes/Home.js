import { useEffect, useState } from "react";
import Table from "../components/Table";

function Home() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRooms, setAvailableRoom] = useState(["54", "52", "51"]);
  const [currentActiveRoom, setCurrentActiveRoom] = useState("54");

  useEffect(() => {
    changeRoom(currentActiveRoom);
  }, []);

  const changeRoom = (label) => {
    if (label == "52")
      setSelectedRoom({
        label: "52",
        currentTemperature: 22.12424,
        minTemperature: 16.56434,
        maxTemperatur: 28.35345123,
        currentCarbon: 1212,
        maxCarbon: 2323,
        minCarbon: 593,
      });
    if (label == "51")
      setSelectedRoom({
        label: "51",
        currentTemperature: 0.12424,
        minTemperature: -2.56434,
        maxTemperatur: 90.35345123,
        currentCarbon: 1212,
        maxCarbon: 2323,
        minCarbon: 593,
      });
    if (label == "54")
      setSelectedRoom({
        label: "54",
        currentTemperature: 90.12424,
        minTemperature: 16.56434,
        maxTemperatur: 91.35345123,
        currentCarbon: 1212,
        maxCarbon: 2323,
        minCarbon: 593,
      });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {selectedRoom && (
        <>
        <div style={{fontSize:17, fontWeight:500, color:"white"}}>
            <>Raum: </>
          <select onChange={(e) => changeRoom(e.target.value)} style={{width:"fit-content",fontSize:17, fontWeight:500, marginLeft:10,  padding:5, borderRadius:10}}>
            {availableRooms.map((ele) => (
              <option value={ele}>
                {ele} {ele == currentActiveRoom && "(aktiv)"}
              </option>
            ))}
          </select>
          </div>
          <Table
            title={"Temperatur"}
            values={[
              selectedRoom.currentTemperature
                .toFixed(1)
                .toString()
                .replaceAll(".", ",") + "℃",
              "min: " +
                selectedRoom.minTemperature
                  .toFixed(1)
                  .toString()
                  .replaceAll(".", ",") +
                "℃",
              "max: " +
                selectedRoom.maxTemperatur
                  .toFixed(1)
                  .toString()
                  .replaceAll(".", ",") +
                "℃",
            ]}
          />
          <Table
            title={"Co2 Gehalt"}
            values={[
              selectedRoom.currentCarbon + "ppm",
              "min: " + selectedRoom.minCarbon + "ppm",
              "max: " + selectedRoom.maxCarbon + "ppm",
            ]}
          />
        </>
      )}
    </div>
  );
}

export default Home;

import "./App.css";
import Home from "./routes/Home";
import { useEffect, useState } from "react";
import Rooms from "./routes/Rooms";
import Settings from "./routes/Settings";
import Export from "./routes/Export";
import HeaderButtons from "./components/HeaderButtons";
import RoomsSelection from "./components/RoomsSelection";

const dateParser = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = date.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};

function App() {
  const [token, setToken] = useState(null);
  const [route, setRoute] = useState(0);
  const [choosenRoom, setChoosenRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentActiveRoom, setCurrentActiveRoom] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now()));

  console.log(password);

  const setActiveRoom = () => {
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/setCurrentActive?roomName=${choosenRoom}`
    )
      .then((response) => response.json())
      .then((response) => {
        setCurrentActiveRoom(response.currentActiveRoom);
      });
  };

  const getToken = () => {
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/getToken?password=${password}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.token) {
          setToken(response.token);
        }
      });
  };

  useEffect(() => {
    if (!token) return;
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/getAvailableRooms&token=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        setAvailableRooms(response.rooms.map((ele) => ele.name));
        setCurrentActiveRoom(response.currentActiveRoom);
        setChoosenRoom(response.currentActiveRoom);
      });
  }, [token]);

  return (
    <div style={{ backgroundColor: "#98a4ab", width: "100%", height: "100%" }}>
      {!token ? (
      <div style={{display: "flex", flexDirection: "row", gap: 10, fontSize: 42}}>
        <label for="userPassword">Password: </label>
        <input id="userPassword" type="password" onChange={e => setPassword(e.target.value)} />
        <button onClick={getToken}>send</button>
      </div>
      ) : (
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
              <label for="start">Start date:</label>
              <input
                type="date"
                id="start"
                name="trip-start"
                value={dateParser(startDate)}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
              <label for="end">End date:</label>
              <input
                type="date"
                id="end"
                name="trip-end"
                value={dateParser(endDate)}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
          )}

          {route == 0 && (
            <Home
              currentActiveRoom={currentActiveRoom}
              token={token}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          {route == 1 && (
            <Rooms
              availableRooms={availableRooms}
              setAvailableRooms={setAvailableRooms}
              setCurrentActiveRoom={setCurrentActiveRoom}
              setChoosenRoom={setChoosenRoom}
              choosenRoom={choosenRoom}
              currentActiveRoom={currentActiveRoom}
              token={token}
            />
          )}
          {route == 2 && <Settings token={token} />}
          {route == 3 && <Export />}
        </div>
      )}
    </div>
  );
}

export default App;

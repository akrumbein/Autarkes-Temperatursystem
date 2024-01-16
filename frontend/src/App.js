import "./App.css";
import Home from "./routes/Home";
import { useEffect, useState } from "react";
import Rooms from "./routes/Rooms";
import Settings from "./routes/Settings";
import Export from "./routes/Export";
import HeaderButtons from "./components/HeaderButtons";
import RoomsSelection from "./components/RoomsSelection";

function App() {
  const [measurementLast, setMeasurementLast] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxCarbon, setMaxCarbon] = useState(null);
  const [minCarbon, setMinCarbon] = useState(null);

  const [token, setToken] = useState(null);
  const [route, setRoute] = useState(0);
  const [choosenRoom, setChoosenRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentActiveRoom, setCurrentActiveRoom] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date(Date.now()).setUTCHours(0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date(Date.now()).setUTCHours(23, 59, 59))
  );
  const [roomInfo, setRoomInfo] = useState();

  const setActiveRoom = () => {
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/setCurrentActive?roomName=${choosenRoom}&token=${token}`
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
      }:6969/getAvailableRooms?token=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        setAvailableRooms(response.rooms.map((ele) => ele.name));
        setCurrentActiveRoom(response.currentActiveRoom);
        setChoosenRoom(response.currentActiveRoom);
      });
  }, [token]);

  useEffect(() => {
    if (choosenRoom == null || !token) return;
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/getRoomInfo?name=${choosenRoom}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}&token=${token}`
    )
      .then((answer) => answer.json())
      .then((response) => {
        if (response.message) {
          console.log(response.message);
          return;
        }
        setRoomInfo(response);
        setMeasurementLast(response.measurements.measurementsLast);
        setMaxTemp(response.measurements.maxTemp);
        setMinTemp(response.measurements.minTemp);
        setMinCarbon(response.measurements.minCarbon);
        setMaxCarbon(response.measurements.maxCarbon);
      });
  }, [choosenRoom, startDate, endDate, token, currentActiveRoom]);

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
        {!token ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              fontSize: 42,
            }}
          >
            <label
              style={{
                fontSize: 25,
                fontWeight: 600,
                color: "white",
              }}
            >
              Password:{" "}
            </label>
            <input
              id="userPassword"
              type="password"
              style={{
                width: 100,
                paddingLeft: 10,
                borderRadius: 5,
                fontSize: 25,
                fontWeight: 600,
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <HeaderButtons onClick={getToken} label={"einloggen"}/>
          </div>
        ) : (
          <>
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
            {route != 2 &&
              (availableRooms.length == 0 ? (
                <h1>
                  Es existieren noch keine Räume bitte erstellen sie einen!
                </h1>
              ) : (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                  {roomInfo &&
                    roomInfo.measurements &&
                    roomInfo.measurements.firstDateOfValues &&
                    roomInfo.measurements.lastDateOfValues && (
                      <div>
                        <label
                          style={{
                            fontSize: 17,
                            fontWeight: 500,
                            color: "white",
                          }}
                        >
                          {"Zeitraum: "}
                        </label>
                        <input
                          type="date"
                          id="start"
                          name="trip-start"
                          min={
                            new Date(roomInfo.measurements.firstDateOfValues)
                              .toISOString()
                              .split("T")[0]
                          }
                          max={
                            new Date(roomInfo.measurements.lastDateOfValues)
                              .toISOString()
                              .split("T")[0]
                          }
                          value={startDate.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setStartDate(
                              new Date(
                                new Date(e.target.value).setUTCHours(0, 0, 0)
                              )
                            )
                          }
                        />
                        <label
                          style={{
                            fontSize: 17,
                            fontWeight: 500,
                            color: "white",
                          }}
                        >
                          {" bis "}
                        </label>
                        <input
                          type="date"
                          id="end"
                          name="trip-end"
                          min={
                            new Date(roomInfo.measurements.firstDateOfValues)
                              .toISOString()
                              .split("T")[0]
                          }
                          max={
                            new Date(roomInfo.measurements.lastDateOfValues)
                              .toISOString()
                              .split("T")[0]
                          }
                          value={endDate.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setEndDate(
                              new Date(
                                new Date(e.target.value).setUTCHours(23, 59, 59)
                              )
                            )
                          }
                        />
                      </div>
                    )}
                </div>
              ))}
            {route == 0 && (
              <Home
                currentActiveRoom={currentActiveRoom}
                token={token}
                startDate={startDate}
                endDate={endDate}
                measurementLast={measurementLast}
              maxTemp={maxTemp}
              minTemp={minTemp}
              maxCarbon={maxCarbon}
              minCarbon={minCarbon}
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
                startDate={startDate}
                endDate={endDate}
                token={token}
              />
            )}
            {route == 2 && <Settings token={token} />}
            {route == 3 && <Export />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

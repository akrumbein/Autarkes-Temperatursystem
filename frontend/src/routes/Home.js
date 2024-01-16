import { useEffect, useState } from "react";
import Table from "../components/Table";
const today = new Date(Date.now());

const dateParser = (date) =>{
  const dd = String(date.getDate()).padStart(2, '0');
const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = date.getFullYear();
return yyyy + '-' + mm + '-' + dd;
}
// only for the html date picker
let realTodayForDatePicker = new Date();


function Home({currentActiveRoom}) {
  let [startDate, setStartDate] = useState(today);
  let [endDate, setEndDate] = useState(today);

  useEffect(() => {
    if (currentActiveRoom == null) return;
    fetch(`http://localhost:6969/getRoomInfo?name=${currentActiveRoom}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`)
      .then((answer) => answer.json())
      .then((response) => {
        console.log(response);
        console.log(response.measurements);
        console.log("reponse");
      });
  }, [currentActiveRoom, startDate, endDate]);

  useEffect(() => {
    if (currentActiveRoom == null) return;

    if (startDate == null) {
      setStartDate(Date.now());
      return
    }

    if (endDate == null) {
      setEndDate(Date.now());
      return
    }

    fetch(`http://localhost:6969/getFilteredMeasurements?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`)
      .then((answer) => answer.json())
      .then((response) => {
        console.log(response.measurements);
      });
  }, [startDate, endDate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {currentActiveRoom && (
        <>
        <label for="start">Start date:</label>
        <input type="date" id="start" name="trip-start" value={dateParser(startDate)} onChange={e => setStartDate(new Date(e.target.value))}/> 
        <label for="end">End date:</label>
        <input type="date" id="end" name="trip-end" value={dateParser(endDate)} onChange={e => setEndDate(new Date(e.target.value))}/> 
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
      <div>{currentActiveRoom}</div>
    </div>
  );
}

export default Home;

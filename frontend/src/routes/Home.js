import { useEffect } from "react";
import Table from "../components/Table";

function Home({currentActiveRoom, token, startDate, endDate}) {
  useEffect(() => {
    if (currentActiveRoom == null) return;
    fetch(`http://localhost:6969/getRoomInfo?name=${currentActiveRoom}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}&token=${token}`)
      .then((answer) => answer.json())
      .then((response) => {
        console.log(response);
        console.log(response.measurements);
        console.log("reponse");
      });
  }, [currentActiveRoom, startDate, endDate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {currentActiveRoom && (
        <>
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

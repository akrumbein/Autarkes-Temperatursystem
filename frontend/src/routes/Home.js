import Table from "../components/Table";

function Home({currentActiveRoom, measurementLast, maxTemp, minTemp, maxCarbon, minCarbon}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {currentActiveRoom && (
        <>
          <Table
            title={"Temperatur"}
            values={[
              <h5>"current Temperatur ℃" {measurementLast}</h5>,
              <h5>
                {"min: " + minTemp.toFixed(1).toString().replaceAll(".", ",") + "℃"}
              </h5>,
              <h5>
                {"max: " + maxTemp.toFixed(1).toString().replaceAll(".", ",") + "℃"}
              </h5>,
            ]}
          />
          <Table
            title={"Co2 Gehalt"}
            values={[
              <h5>currentCarbon + "ppm"</h5>,
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

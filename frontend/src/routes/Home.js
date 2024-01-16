import Table from "../components/Table";

function Home({currentActiveRoom}) {
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

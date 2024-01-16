import Table from "../components/Table";

function Home({currentActiveRoom, roomInfo}) {
  console.log(roomInfo?.measurements?.measurementLast);
  return (
      roomInfo && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {currentActiveRoom && roomInfo && (
        <>
          <Table
            title={"Temperatur"}
            values={[
              <h5>{roomInfo.measurements.measurementLast.temp + "℃"} </h5>,
              <h5>
                {"min: " + roomInfo.measurements.minTemp.toFixed(1).toString().replaceAll(".", ",") + "℃"}
              </h5>,
              <h5>
                {"max: " + roomInfo.measurements.maxTemp.toFixed(1).toString().replaceAll(".", ",") + "℃"}
              </h5>,
            ]}
          />
          <Table
            title={"Co2 Gehalt"}
            values={[
              <h5>{roomInfo.measurements.measurementLast.carbon + "ppm"}</h5>,
              <h5>{"min: " + roomInfo.measurements.minCarbon + "ppm"}</h5>,
              <h5>{"max: " + roomInfo.measurements.maxCarbon + "ppm"}</h5>,
            ]}
          />
        </>
      )}
    </div>
    
  );
}

export default Home;

import { useEffect, useState } from "react";
import Table from "../components/Table";
import { BarChart } from "@mui/x-charts/BarChart";

function Home({
  currentActiveRoom,
  roomInfo,
  token,
  choosenRoom,
  startDate,
  endDate,
}) {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    if (!choosenRoom) return;
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/getMeasurements?roomName=${choosenRoom}&token=${token}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}&all=true`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          console.log(response.message);
          return;
        }
        setMeasurements(response.measurements);
      });

    const interval = setInterval(() => {
      fetch(
        `http://${
          window.location.host.split(":")[0]
        }:6969/getMeasurements?roomName=${choosenRoom}&token=${token}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}&all=true`
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message) {
            console.log(response.message);
            return;
          }
          setMeasurements(response.measurements);
        });
    }, 600);
    return () => clearInterval(interval);
  }, [choosenRoom, currentActiveRoom, startDate, endDate]);

  return (
    roomInfo && (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentActiveRoom && roomInfo && (
          <>
            <Table
              title={"Temperatur"}
              values={[
                <h5
                  style={{
                    color:
                      roomInfo?.room?.maxTemp <
                        roomInfo?.measurements?.measurementLast?.temp ||
                      roomInfo?.room?.minTemp >
                        roomInfo?.measurements?.measurementLast?.temp
                        ? "red"
                        : "black",
                  }}
                >
                  {(roomInfo?.measurements?.measurementLast?.temp | 0) + "℃"}{" "}
                </h5>,
                <h5>
                  {"min: " +
                    (roomInfo?.measurements?.minTemp |0)
                      ?.toFixed(1)
                      ?.toString()
                      ?.replaceAll(".", ",") +
                    "℃"}
                </h5>,
                <h5>
                  {"max: " +
                    (roomInfo?.measurements?.maxTemp |0)
                      ?.toFixed(1)
                      ?.toString()
                      ?.replaceAll(".", ",") +
                    "℃"}
                </h5>,
              ]}
            />
            <Table
              title={"Co2 Gehalt"}
              values={[
                <h5
                  style={{
                    color:
                      roomInfo?.room?.maxCarbon <
                      roomInfo?.measurements?.measurementLast?.carbon
                        ? "red"
                        : "black",
                  }}
                >
                  {(roomInfo?.measurements?.measurementLast?.carbon | 0 ) + "ppm"}
                </h5>,
                <h5>{"min: " + (roomInfo?.measurements?.minCarbon | 0) + "ppm"}</h5>,
                <h5>{"max: " + (roomInfo?.measurements?.maxCarbon | 0) + "ppm"}</h5>,
              ]}
            />
            {measurements?.length > 0 && (
              <BarChart
                width={800}
                height={500}
                xAxis={[
                  {
                    data: measurements?.map((ele) =>
                      new Date(ele?.timestamp).toLocaleString()
                    ),
                    scaleType: "band",
                  },
                ]}
                yAxis={[{}]}
                series={[
                  {
                    data: measurements?.map((ele) => ele?.temp),
                  },
                ]}
              />
            )}
          </>
        )}
      </div>
    )
  );
}

export default Home;

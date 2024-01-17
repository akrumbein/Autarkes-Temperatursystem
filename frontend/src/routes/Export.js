import { useState } from "react";
import HeaderButtons from "../components/HeaderButtons";
import Settings from "./Settings";

function Export({ choosenRoom, startDate, endDate, token }) {
  const [settings, setSettings] = useState({
    noTemperature: false,
    noCarbon: false,
    noId: true,
    noTime: false,
    noRoomName: true,
  });
  const [wantPDF, setWantPDF] = useState(false);
  const [wantHeader, setWantHeader] = useState(false);
  const [timeFormat, setTimeFormat] = useState("DE");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ color: "white" }}>{"EXPORT"}</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: 50 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ paddingBottom: 10 }}>
            <label style={{ color: "white", fontWeight: 500, fontSize: 17 }}>
              Tabellen-Einstellung
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={!settings.noId}
              onChange={() =>
                setSettings((old) => {
                  return { ...old, noId: !old.noId };
                })
              }
            />
            <label>DB-ID</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={!settings.noTemperature}
              onChange={() =>
                setSettings((old) => {
                  return { ...old, noTemperature: !old.noTemperature };
                })
              }
            />
            <label>Temperatur</label>
          </div>
          <div>
            <input
              checked={!settings.noCarbon}
              type="checkbox"
              onChange={() =>
                setSettings((old) => {
                  return { ...old, noCarbon: !old.noCarbon };
                })
              }
            />
            <label>CO2</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={!settings.noTime}
              onChange={() =>
                setSettings((old) => {
                  return { ...old, noTime: !old.noTime };
                })
              }
            />
            <label>Zeit</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={!settings.noRoomName}
              onChange={() =>
                setSettings((old) => {
                  return { ...old, noRoomName: !old.noRoomName };
                })
              }
            />
            <label>Raumname</label>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ paddingBottom: 10 }}>
            <label style={{ color: "white", fontWeight: 500, fontSize: 17 }}>
              Export-Format
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={!wantPDF}
              onChange={() => setWantPDF((old) => !old)}
            />
            <label>CSV</label>
          </div>

          <div>
            <input
              type="checkbox"
              checked={wantPDF}
              onChange={() => setWantPDF((old) => !old)}
            />
            <label>PDF</label>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ paddingBottom: 10 }}>
            <label style={{ color: "white", fontWeight: 500, fontSize: 17 }}>
              Sonstige Einstellung
            </label>
          </div>
          {!wantPDF && (
            <div style={{ width: 190 }}>
              <input
                type="checkbox"
                checked={wantHeader}
                onChange={() => setWantHeader((old) => !old)}
              />
              <label>Spaltenkopf in der CSV?</label>
            </div>
          )}
          {!settings.noTime && (
            <div>
              <label style={{ marginLeft: 5 }}>Zeit-Format: </label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                style={{
                  width: "fit-content",
                  marginLeft: 10,
                  padding: 5,
                  borderRadius: 10,
                }}
              >
                <option value={"ISO"}>ISO-Format</option>
                <option value={"UTC"}>UTC-Format</option>
                <option value={"DE"}>Deutsches-Format</option>
                <option value={"STANDART"}>Zeit in MS</option>
              </select>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <a
            style={{
              width: "fit-content",
              border: "1px solid #0077CC",
              borderRadius: 4,
              padding: 10,
              fontSize: 19,
              fontWeight: 400,
              backgroundImage: "linear-gradient(#42A1EC, #0070C9)",
              color: "#ffffff",
              textDecoration: "none",
            }}
            href={`http://${
              window.location.host.split(":")[0]
            }:6969/exportData?roomName=${choosenRoom}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}&token=${token}&header=${wantHeader}&noTemperature=${
              settings.noTemperature
            }&noCarbon=${settings.noCarbon}&noId=${settings.noId}&noTime=${
              settings.noTime
            }&noRoomName=${settings.noRoomName}&timeFormat=${timeFormat}`}
            target="__blank"
          >
            Exportieren
          </a>
        </div>
      </div>
    </div>
  );
}

export default Export;

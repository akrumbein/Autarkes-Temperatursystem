import { useEffect, useState } from "react";
import Table from "../components/Table";

function Settings() {
  const [settings, setSettings] = useState([]);
  const [changedSettings, setChangedSettings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6969/getConfigurations")
      .then((response) => response.json())
      .then((response) => setSettings(response.config));
  }, []);

  const SaveSetting = (key) => {
    if (
      !changedSettings.find((ele) => ele.key == key) ||
      !changedSettings.find((ele) => ele.key == key).value
    )
      return;
    fetch(
      `http://localhost:6969/saveConfig?key=${key}&value=${
        changedSettings.find((ele) => ele.key == key).value
      }`
    )
      .then((response) => response.json())
      .then((response) => {
        setSettings(response.config);
        setChangedSettings((old) => old.filter((ele) => ele.key != key));
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {settings.map((ele) => (
        <Table
          key={ele.key}
          title={ele.unit}
          values={[
            <input
              key={1}
              defaultValue={ele.key != "password" ? ele.value : ""}
              style={{
                width: 50,
                margin: 15,
                paddingLeft: 10,
                borderRadius: 5,
              }}
              type={
                ele.type == "FLOAT" || ele.type == "INTEGER"
                  ? "number"
                  : "password"
              }
              onChange={(e) => {
                setChangedSettings((old) => [
                  ...old.filter((element) => element.key != ele.key),
                  { key: ele.key, value: e.target.value },
                ]);
              }}
            />,
            changedSettings.find((element) => element.key == ele.key) ? (
              <button
                key={2}
                style={{
                  marginTop: 12,
                  marginBottom: 12,
                  border: "1px solid #0077CC",
                  borderRadius: 4,
                  padding: 10,
                  backgroundImage: "linear-gradient(#42A1EC, #0070C9)",
                  color: "#ffffff",
                  width: 80,
                }}
                onClick={() => SaveSetting(ele.key)}
              >
                Speichern
              </button>
            ) : (
              <div key={3} style={{ width: 80 }}></div>
            ),
          ]}
        />
      ))}
    </div>
  );
}

export default Settings;

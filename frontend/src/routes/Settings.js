import { useEffect, useState } from "react";
import Table from "../components/Table";

function Settings({ token }) {
  const [settings, setSettings] = useState([]);
  const [changedSettings, setChangedSettings] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/getConfigurations?token=${token}`
    )
      .then((response) => response.json())
      .then((response) => setSettings(response.config));
  }, []);

  const SaveSetting = (key) => {
    if (
      !changedSettings.find((ele) => ele.key == key) ||
      !changedSettings.find((ele) => ele.key == key).value
    )
      return;
    setError((old) => old.filter((ele) => ele.key != key));
    if ((key == "password")) {
      const value = changedSettings.find((ele) => ele.key == key).value;
      if (value.length != 4) {
        setError((old) => [
          ...old,
          { key, message: "Passwort muss 4-stellig sein!" },
        ]);
        return;
      }
      if (!/^\d+$/.test(value)) {
        setError((old) => [
          ...old,
          { key, message: "Passwort darf nur Zahlen enthalten!" },
        ]);
        return;
      }
    }

    fetch(
      `http://${
        window.location.host.split(":")[0]
      }:6969/saveConfig?key=${key}&value=${
        changedSettings.find((ele) => ele.key == key).value
      }&token=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          setError((old) => [...old, { key, message: response.message }]);
        }
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
            error.find((element) => element.key == ele.key) && (
              <label style={{color:"red"}} key={0}>
                {error.find((element) => element.key == ele.key).message}
              </label>
            ),

            <input
              key={1}
              defaultValue={ele.value}
              style={{
                width: 50,
                margin: 15,
                paddingLeft: 10,
                borderRadius: 5,
              }}
              type={
                ele.type == "FLOAT" || ele.type == "INTEGER" ? "number" : "text"
              }
              onChange={(e) => {
                setChangedSettings((old) => [
                  ...old.filter((element) => element.key != ele.key),
                  { key: ele.key, value: e.target.value },
                ]);
              }}
              {...(ele.key == "password"
                ? {
                    defaultValue: "",
                    type: "password",
                  }
                : {})}
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

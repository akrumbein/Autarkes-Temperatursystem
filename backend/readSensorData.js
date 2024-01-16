import CO2Monitor from "node-co2-monitor";
import Gpio from "onoff";
import readline from "readline";

const readSensorData = (db) => {
  const monitor = new CO2Monitor();

  try {
    // Connect device.
    monitor.connect((err) => {
      if (err) {
        return console.error(err.stack);
      }
      console.log("Monitor connected.");

      const interval = setInterval(async () => {
        const currentInterval = await db.get(
          "SELECT value from CONFIGURATION Where key like 'measureInterval'"
        );
        if (parseFloat(currentInterval.value)) {
          interval._repeat = currentInterval.value * 60000;
        }
        if (monitor.temperature && monitor.co2) {
          const currentActiveRoom = await db.get(
            "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
          );
          if (!currentActiveRoom?.value) return;

          await db.get(
            `INSERT INTO MEASUREMENTS(temp, carbon, timestamp, roomName) VALUES(${
              monitor.temperature
            }, ${monitor.co2}, ${Date.now()},"${currentActiveRoom.value}")`
          );
        }
      }, 1000);
      // Read data from CO2 monitor.
      monitor.transfer();
    });

    // Error handler
    monitor.on("error", (err) => {
      console.error(err.stack);
      // Disconnect device
      monitor.disconnect(() => {
        console.log("Monitor disconnected.");
        // process.exit(0);
      });
    });
  } catch (error) {
    console.log(error);
    const interval = setInterval(async () => {
      const currentInterval = await db.get(
        "SELECT value from CONFIGURATION Where key like 'measureInterval'"
      );
      if (parseFloat(currentInterval.value)) {
        interval._repeat = currentInterval.value * 60000;
      }

      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );
      if (!currentActiveRoom?.value) return;

      await db.exec(
        `INSERT INTO MEASUREMENTS(temp, carbon, timestamp, roomName) VALUES(${22}, 1700, ${Date.now()},"${
          currentActiveRoom.value
        }")`
      );
    }, 1000);
  }

  try {
    const test = Gpio.Gpio;

    const sda = new test(10, "out");
    const ledDisplay = new test(18, "out");
    const a0Display = new test(23, "out");
    const resetDisplay = new test(24, "out");

    const test2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    /*const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );

      const measurement = await db.get(
        `SELECT * FROM MEASUREMENTS WHERE roomName like "${currentActiveRoom.value}" ORDER BY timestamp`
      );

    test2.question("LED?", (name) => {
      ledDisplay.writeSync(parseInt(name));
      test2.question("AO?", (name) => {
        a0Display.writeSync(parseInt(name));
        test2.question("sda?", (name) => {
          sda.writeSync(parseInt(name));
        });
      });
    });*/
  } catch (error) {
    console.log(error);
  }
};

export default readSensorData;

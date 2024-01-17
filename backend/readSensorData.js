import CO2Monitor from "node-co2-monitor";
import { spawn, exec } from 'node:child_process';

const readSensorData = (db) => {
  const monitor = new CO2Monitor();

  try {
    // Connect device.
    monitor.connect((err) => {
      if (err) {
        return console.error(err.stack);
      }
      console.log("Monitor connected.");

      monitor.on('temp', (temperature) => {
        exec('ls', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        }); 
       // spawn(`sudo python3 /home/pi/Autarkes-Temperatursystem/python/test.py ${temperature}`)
        console.log(`temp: ${ temperature }`);
    });

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
};

export default readSensorData;

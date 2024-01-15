import CO2Monitor from "node-co2-monitor";

const readSensorData = (db) => {
  const monitor = new CO2Monitor();

  try {
    // Connect device.
    monitor.connect((err) => {
      if (err) {
        return console.error(err.stack);
      }
      console.log("Monitor connected.");

      setInterval(()=>{
        monitor.once("temp", "temp", (temperature) => {
          console.log(`temp: ${temperature}`);
        })
      }, 1000)
      
      // Read data from CO2 monitor.
      //monitor.transfer();
    });

    // Get results.
    /*monitor.on();
    monitor.on("co2", (co2) => {
      console.log(`co2: ${co2}`);
    });*/

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
    setInterval(async () => {
      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );
      if (!currentActiveRoom?.value) return;

      await db.get(
        `INSERT INTO MEASUREMENTS(temp, carbon, timestamp, roomName) VALUES(${22}, 1700, ${Date.now()},"${
          currentActiveRoom.value
        }")`
      );
    }, 1000);
  }
};

export default readSensorData;

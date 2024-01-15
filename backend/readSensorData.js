import CO2Monitor from "node-co2-monitor";
import Gpio from "onoff";
import readline from "readline"

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
    const ledDisplay = new test(18, "out")
    const a0Display = new test(23, "out")
    const resetDisplay = new test(24, "out")

    readline.createInterface({
      input: process.stdin,
output: process.stdout
    })
    blinkLED()

    setInterval( async()=>{
      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );

      const measurement = await db.get(
        `SELECT * FROM MEASUREMENTS WHERE roomName like "${currentActiveRoom.value}" ORDER BY timestamp`
      );


      readline.question('LED?', name => {
        ledDisplay.writeSync(name);
      });

      readline.question('AO?', name => {
        a0Display.writeSync(name);
      });

      readline.question('sda?', name => {
        sda.writeSync(name);
      });
    }, 1000)

    function blinkLED() {
      

      //function to start blinking
      //if (LED.readSync() === 0) {
        //check the pin state, if the state is 0 (or off)
      //  LED.writeSync(1); //set pin state to 1 (turn LED on)
      //} else {
      //  LED.writeSync(0); //set pin state to 0 (turn LED off)
      //}
    }
  } catch (error) {
    console.log(error);
  }
};

export default readSensorData;

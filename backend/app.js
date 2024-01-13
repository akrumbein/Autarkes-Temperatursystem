import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import InitializeDB from "./db/initialize.js";
import readSensorData from "./readSensorData.js";

const insertDummyData = (db) =>{
  db.exec(
    `DELETE FROM ROOMS`
  );

  db.exec(
    `DELETE FROM CONFIGURATION WHERE key like 'currentActiveRoom'`
  );

  db.exec(
    `INSERT INTO ROOMS (
        name,
        minTemp,
        maxTemp,
        maxCarbon
      )
      VALUES(
        "41",
        20,
        30,
        300
      )
    `
  );
  db.exec(
    `INSERT INTO ROOMS (
        name
      )
      VALUES(
        "43"
      )
    `
  );
  db.exec(
    `INSERT INTO ROOMS (
        name
      )
      VALUES(
        "44"
      )
    `
  );

  db.exec(
    `INSERT INTO CONFIGURATION (
        key,
        value,
        type
      )
      VALUES(
        "currentActiveRoom",
        "44",
        "TEXT"
      )
    `
  );
}

const app = express();
const port = 6969;
open({
  filename: "./database.db",
  driver: sqlite3.Database,
})
  .then(async (db) => {
    await InitializeDB(db);

    readSensorData(db);
    insertDummyData(db);

    app.get("/getAvailableRooms", async (req, res) => {
      const allrooms = await db.all("SELECT name FROM ROOMS")
      const currentActiveRoom = await db.get("SELECT value from CONFIGURATION Where key like 'currentActiveRoom'")
      res.send({rooms:allrooms, currentActiveRoom: currentActiveRoom?.value})
    });

    app.get("/getCurrentActive", async (req, res) => {
      const currentActiveRoom = await db.get("SELECT value from CONFIGURATION Where key like 'currentActiveRoom'")
      res.send({currentActiveRoom: currentActiveRoom?.value})
    });

    app.get("/getRoomInfo", async (req, res) => {
      console.log(req.query);
      if(!req.query.name)
      {
        res.send("Please provide a name!")
        return
      }
      const room = await db.get("SELECT * FROM ROOMS WHERE name like '" + req.query.name + "'")
      await Promise.all(["minTemp", "maxTemp", "defaultTemp", "maxCarbon", "defaultCarbon"].map(async (element) => {
        if(!room[element]){
          const configValue = await db.get(`SELECT value, type from CONFIGURATION Where key like '${element}'`)
          room[element] = configValue.type == "INTEGER"? parseInt(configValue?.value) : configValue.type == "FLOAT"? parseFloat(configValue?.value) : configValue?.value
          console.log(await db.get(`SELECT value from CONFIGURATION Where key like '${element}'`));
          console.log(room);
        }   
      }));
      res.send({room})
    });

    app.get("/getConfigurations", async (req, res) => {
      const config = await db.all("SELECT * from CONFIGURATION")
      config.forEach(element => {
        element.value = element.type == "INTEGER"? parseInt(element.value) : element.type == "FLOAT"? parseFloat(element.value) :  element.value
      });
      res.send({config})
    });

    app.listen(port, () => {
      console.log(`Online listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));

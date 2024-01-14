import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bcrypt from "bcrypt";
import { open } from "sqlite";
import InitializeDB from "./db/initialize.js";
import readSensorData from "./readSensorData.js";

const app = express();
const port = 6969;
app.use(cors());
open({
  filename: "./database.db",
  driver: sqlite3.Database,
})
  .then(async (db) => {
    await InitializeDB(db);

    readSensorData(db);

    app.get("/getAvailableRooms", async (req, res) => {
      const allrooms = await db.all("SELECT name FROM ROOMS");
      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );
      res.send({
        rooms: allrooms,
        currentActiveRoom: currentActiveRoom?.value,
      });
    });

    app.get("/addRoom", async (req, res) => {
      if (!req.query.name) {
        res.send("Please provide a name!");
        return;
      }
      const name = req.query.name;

      const findDublicateRoom = await db.get(
        `SELECT * FROM ROOMS WHERE name like "${name}"`
      );

      if (findDublicateRoom) {
        res.send({ error: "Raum name wurde bereits gefunden!" });
        return;
      }

      await db.exec(`INSERT INTO ROOMS (name) VALUES("${name}")`);

      const allrooms = await db.all("SELECT name FROM ROOMS");

      if (allrooms.length == 1) {
        await db.exec(
          `INSERT INTO CONFIGURATION (key, value, type, unit) VALUES("currentActiveRoom","${name}", "TEXT", "Aktuell aktiver Raum")`
        );
      }

      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );
      res.send({
        rooms: allrooms,
        currentActiveRoom: currentActiveRoom?.value,
      });
    });

    app.get("/getCurrentActive", async (req, res) => {
      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );
      res.send({ currentActiveRoom: currentActiveRoom?.value });
    });

    app.get("/setCurrentActive", async (req, res) => {
      if (!req.query.roomName) {
        res.send("Please provide a roomName!");
        return;
      }
      const roomName = req.query.roomName;

      await db.exec(
        `UPDATE CONFIGURATION SET value = "${roomName}" Where key like 'currentActiveRoom'`
      );

      res.send({ currentActiveRoom: roomName });
    });

    app.get("/getRoomInfo", async (req, res) => {
      if (!req.query.name) {
        res.send("Please provide a name!");
        return;
      }
      const room = await db.get(
        "SELECT * FROM ROOMS WHERE name like '" + req.query.name + "'"
      );
      if (!room) {
        res.send("Raum wurde nicht gefunden!");
        return;
      }
      await Promise.all(
        ["minTemp", "maxTemp", "defaultTemp", "maxCarbon", "defaultCarbon"].map(
          async (element) => {
            if (!room[element]) {
              const configValue = await db.get(
                `SELECT value, type from CONFIGURATION Where key like '${element}'`
              );
              room[element] =
                configValue.type == "INTEGER"
                  ? parseInt(configValue?.value)
                  : configValue.type == "FLOAT"
                  ? parseFloat(configValue?.value)
                  : configValue?.value;
              console.log(
                await db.get(
                  `SELECT value from CONFIGURATION Where key like '${element}'`
                )
              );
              console.log(room);
            }
          }
        )
      );
      res.send({ room });
    });

    app.get("/getMeasurements", async (req, res) => {
      if (!req.query.roomName) {
        res.send("Please provide a roomName!");
        return;
      }
      const roomName = req.query.roomName;

      const allMeasurements = await db.all(
        `SELECT * FROM MEASUREMENTS WHERE roomName like "${roomName}" ORDER BY timestamp DESC LIMIT 5`
      );

      res.send({
        measurements: allMeasurements,
      });
    });

    app.get("/getConfigurations", async (req, res) => {
      const config = await db.all("SELECT * from CONFIGURATION");
      config.forEach((element) => {
        element.value =
          element.type == "INTEGER"
            ? parseInt(element.value)
            : element.type == "FLOAT"
            ? parseFloat(element.value)
            : element.value;
      });
      res.send({ config });
    });

    app.get("/saveConfig", async (req, res) => {
      if (!req.query.key) {
        res.send("Please provide a key!");
        return;
      }
      const key = req.query.key;
      if (!req.query.value) {
        res.send("Please provide a value!");
        return;
      }
      const value =
        key == "password"
          ? bcrypt.hashSync(req.query.value, 2)
          : req.query.value;

      const alreadyExistsConfig = await db.get(
        `SELECT * from CONFIGURATION WHERE key like "${key}"`
      );
      if (alreadyExistsConfig) {
        await db.exec(
          `UPDATE CONFIGURATION SET value = "${value}" WHERE key like "${key}"`
        );
      } else {
        await db.exec(
          `INSERT INTO CONFIGURATION (key, value) VALUES("${value}","${key}")`
        );
      }
      const config = await db.all("SELECT * from CONFIGURATION");
      config.forEach((element) => {
        element.value =
          element.type == "INTEGER"
            ? parseInt(element.value)
            : element.type == "FLOAT"
            ? parseFloat(element.value)
            : element.value;
      });
      res.send({ config });
    });

    app.listen(port, () => {
      console.log(`Online listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));

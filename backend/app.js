import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bcrypt from "bcrypt";
import { open } from "sqlite";
import InitializeDB from "./db/initialize.js";
import readSensorData from "./readSensorData.js";
import fs from "fs";
import { stringify } from "csv-stringify";
import * as StreamPromises from "stream/promises";

const app = express();
const port = 6969;
app.use(cors());
open({
  filename: "./database.db",
  driver: sqlite3.Database,
})
  .then(async (db) => {
    const token = (Math.random() + 1).toString(36).substring(7);

    const startupTime = Date.now();

    await InitializeDB(db);

    readSensorData(db);

    app.get("/getFilteredMeasurements", async (req, res) => {
      if (!req.query.startDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      if (!req.query.endDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      const measurements = await db.all(
        "SELECT * from Measurements WHERE " +
          req.query.startDate +
          " < timestamp AND " +
          req.query.endDate +
          " > timestamp"
      );

      res.send({
        measurements: measurements,
      });
    });

    app.get("/getAvailableRooms", async (req, res) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
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
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
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
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
      const currentActiveRoom = await db.get(
        "SELECT value from CONFIGURATION Where key like 'currentActiveRoom'"
      );
      res.send({ currentActiveRoom: currentActiveRoom?.value });
    });

    app.get("/setCurrentActive", async (req, res) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
      if (!req.query.roomName) {
        res.send("Please provide a roomName!");
        return;
      }
      const roomName = req.query.roomName;

      await db.exec(
        `UPDATE CONFIGURATION SET value = "${roomName}" Where key like 'currentActiveRoom'`
      );

      await db.exec(
        `UPDATE MEASUREMENTS SET roomName = "${roomName}" WHERE timestamp > ${startupTime}`
      );

      res.send({ currentActiveRoom: roomName });
    });

    app.get("/getRoomInfo", async (req, res) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
      if (!req.query.name) {
        res.send({
          message: "Please provide a name!",
        });
        return;
      }

      if (!req.query.startDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      if (!req.query.endDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      const room = await db.get(
        "SELECT * FROM ROOMS WHERE name like '" + req.query.name + "'"
      );

      if (!room) {
        res.send("Raum wurde nicht gefunden!");
        return;
      }

      const measurementLast = await db.get(
        "SELECT * from Measurements WHERE " +
          req.query.startDate +
          " < timestamp AND " +
          req.query.endDate +
          " > timestamp AND roomName = '" +
          req.query.name +
          "' ORDER BY timestamp desc LIMIT 1"
      );

      const tempMax = await db.get(
        "SELECT MAX(temp) AS tempMax from Measurements WHERE " +
          req.query.startDate +
          " < timestamp AND " +
          req.query.endDate +
          " > timestamp AND roomName = '" +
          req.query.name +
          "'"
      );

      const tempMin = await db.get(
        "SELECT MIN(temp) AS tempMin from Measurements WHERE " +
          req.query.startDate +
          " < timestamp AND " +
          req.query.endDate +
          " > timestamp AND roomName = '" +
          req.query.name +
          "'"
      );

      const carbonMax = await db.get(
        "SELECT MAX(carbon) AS carbonMax from Measurements WHERE " +
          req.query.startDate +
          " < timestamp AND " +
          req.query.endDate +
          " > timestamp AND roomName = '" +
          req.query.name +
          "'"
      );

      const carbonMin = await db.get(
        "SELECT MIN(carbon) AS carbonMin from Measurements WHERE " +
          req.query.startDate +
          " < timestamp AND " +
          req.query.endDate +
          " > timestamp AND roomName = '" +
          req.query.name +
          "'"
      );

      const firstDateOfValues = await db.get(
        `SELECT MIN(timestamp) AS firstDateOfValues from Measurements WHERE roomName = "${req.query.name}"`
      );

      const lastDateOfValues = await db.get(
        `SELECT MAX(timestamp) AS lastDateOfValues from Measurements WHERE roomName = "${req.query.name}"`
      );

      const measurements = {
        measurementLast: measurementLast,
        maxTemp: tempMax.tempMax,
        minTemp: tempMin.tempMin,
        maxCarbon: carbonMax.carbonMax,
        minCarbon: carbonMin.carbonMin,
        firstDateOfValues: firstDateOfValues.firstDateOfValues,
        lastDateOfValues: lastDateOfValues.lastDateOfValues,
      };

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
            }
          }
        )
      );
      res.send({ room, measurements });
    });

    app.get("/getMeasurements", async (req, res) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
      if (!req.query.roomName) {
        res.send({ message: "Please provide a roomName!" });
        return;
      }
      const roomName = req.query.roomName;

      if (!req.query.page) {
        res.send({ message: "Please provide a page!" });
        return;
      }

      if (!req.query.startDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      if (!req.query.endDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      const allMeasurements = await db.all(
        `SELECT * FROM MEASUREMENTS WHERE ${
          req.query.startDate
        } < timestamp AND ${
          req.query.endDate
        } > timestamp AND roomName like "${roomName}" ORDER BY timestamp DESC LIMIT 5 OFFSET ${
          req.query.page * 5
        }`
      );

      const countMeasurements = await db.get(
        `SELECT COUNT(*) as countMeasurements FROM MEASUREMENTS WHERE ${req.query.startDate} < timestamp AND ${req.query.endDate} > timestamp AND roomName like "${roomName}"`
      );

      res.send({
        measurements: allMeasurements,
        pages: parseInt(countMeasurements.countMeasurements / 5) + 1,
      });
    });

    app.get("/getConfigurations", async (req, res) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
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

    app.get("/saveConfig", async (req, res) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }
      if (!req.query.key) {
        res.send({ message: "Please provide a key!" });
        return;
      }
      const key = req.query.key;
      if (!req.query.value) {
        res.send({ message: "Please provide a value!" });
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

    app.get("/getToken", async (req, res) => {
      if (!req.query.password) {
        res.send({ message: "Please provide a password!" });
        return;
      }
      const password = req.query.password;
      const bdPassword = await db.get(
        "SELECT * from CONFIGURATION WHERE key like 'password'"
      );
      if (bcrypt.compareSync(password, bdPassword.value)) {
        res.send({ token: token });
      } else {
        res.send({ message: "Passwort fehlerhaft!" });
      }
    });

    app.get("/exportData", async (req, res, next) => {
      if (!req.query.token || req.query.token != token) {
        res.send({ message: "Please provide a correct token!" });
        return;
      }

      if (!req.query.roomName) {
        res.send({ message: "Please provide a roomName!" });
        return;
      }

      if (!req.query.startDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }

      if (!req.query.endDate) {
        res.send({
          message: "Please provide a end date!",
        });
        return;
      }
      let columns = ["id", "temp", "carbon", "timestamp", "roomName"];
      if (req?.query?.noTemperature == "true") {
        columns = columns.filter((ele) => ele != "temp");
      }

      if (req?.query?.noCarbon == "true") {
        columns = columns.filter((ele) => ele != "carbon");
      }

      if (req?.query?.noId == "true") {
        columns = columns.filter((ele) => ele != "id");
      }

      if (req?.query?.noTime == "true") {
        columns = columns.filter((ele) => ele != "timestamp");
      }

      if (req?.query?.noRoomName == "true") {
        columns = columns.filter((ele) => ele != "roomName");
      }

      const stringifier = stringify({
        header: req?.query?.header == "true" ? true : false,
        columns: columns,
      });
      let allMeasurements = await db.all(
        `SELECT * FROM MEASUREMENTS WHERE ${req.query.startDate} < timestamp AND ${req.query.endDate} > timestamp AND roomName like "${req.query.roomName}" ORDER BY timestamp DESC`
      );

      allMeasurements = allMeasurements.map((ele) => {
        let newTime = ele.timestamp;
        switch (req?.query?.timeFormat) {
          case "ISO":
            newTime = new Date(ele.timestamp).toISOString();
            break;
          case "UTC":
            newTime = new Date(ele.timestamp).toUTCString();
            break;
          case "DE":
            newTime = new Date(ele.timestamp).toLocaleString();
            break;

          default:
            break;
        }
        return { ...ele, timestamp: newTime };
      });

      res.set("Content-Type", "text/csv; charset=utf-8");
      res.header(
        `Content-Disposition`,
        `attachment; filename="${req.query.roomName}_${
          new Date(Date.now()).toLocaleString().replaceAll(", ", "_")}.csv"`
      );

      stringifier.pipe(res);
      allMeasurements.forEach((ele) => stringifier.write(ele));
      res.end();
    });

    app.listen(port, () => {
      console.log(`Online listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));

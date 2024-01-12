import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import InitializeDB from "./db/initialize.js";
import readSensorData from "./readSensorData.js";

const app = express();
const port = 6969;
open({
  filename: "./database.db",
  driver: sqlite3.Database,
})
  .then(async (db) => {
    await InitializeDB(db);

    readSensorData(db);

    app.listen(port, () => {
      console.log(`Online listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
import bcrypt from "bcrypt";

const InitializeDB = async (db) => {
  /*db.exec(`DROP TABLE ROOMS`);
  db.exec(`DROP TABLE MEASUREMENTS`);
  db.exec(`DROP TABLE CONFIGURATION`);*/

  db.exec(
    `CREATE TABLE IF NOT EXISTS ROOMS 
        (
          name TEXT PRIMARY KEY,
          minTemp NUMERIC,
          maxTemp NUMERIC,
          defaultTemp NUMERIC,
          maxCarbon INTEGER,
          defaultCarbon INTEGER
          )`
  );
  db.exec(
    `CREATE TABLE IF NOT EXISTS MEASUREMENTS 
        (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          temp NUMERIC,
          carbon INTEGER,
          timestamp DATETIME,
          roomName Text
          )`
  );
  db.exec(
    `CREATE TABLE IF NOT EXISTS Configuration
        (
          key TEXT PRIMARY KEY, 
          value TEXT,
          type TEXT,
          unit TEXT
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "password", "${bcrypt.hashSync("nimda", 2)}", "TEXT", "Passwort"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "password"
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "measureInterval", "1000", "FLOAT", "Speicher-Intervall in Minuten"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "measureInterval"
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "defaultCarbon", "1000", "INTEGER", "Empfohlener Co2-Gehalt in ppm"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "defaultCarbon"
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "maxCarbon", "1700", "INTEGER", "Maximaler CO2-Gehalt in ppm"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "maxCarbon"
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "minTemp", "19", "FLOAT", "Minimale Temperatur in ℃"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "minTemp"
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "maxTemp", "28", "FLOAT", "Maximale Temperatur in ℃"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "maxTemp"
        )`
  );

  db.exec(
    `INSERT INTO Configuration (key, value, type, unit)
        SELECT "defaultTemp", "22.1", "FLOAT", "Empfohlene Temperatur in ℃"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "defaultTemp"
        )`
  );
};

export default InitializeDB;

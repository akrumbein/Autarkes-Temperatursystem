const InitializeDB = async (
  db
) => {
    /*
      db.exec(
        `DROP TABLE ROOMS`
      );
      db.exec(
        `DROP TABLE MEASUREMENTS`
      );
      db.exec(
        `DROP TABLE CONFIGURATION`
      );
      */
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
          value NUMERIC,
          type TEXT,
          timestamp DATETIME,
          roomName Text
          )`
      );
      db.exec(
        `CREATE TABLE IF NOT EXISTS Configuration
        (
          key TEXT PRIMARY KEY, 
          value TEXT,
          type TEXT
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value, type)
        SELECT "measureInterval", "1000", "INTEGER"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "measureInterval"
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value, type)
        SELECT "defaultCarbon", "1000", "INTEGER"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "defaultCarbon"
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value, type)
        SELECT "maxCarbon", "1700", "INTEGER"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "maxCarbon"
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value, type)
        SELECT "minTemp", "19", "FLOAT"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "minTemp"
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value, type)
        SELECT "maxTemp", "28", "FLOAT"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "maxTemp"
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value, type)
        SELECT "defaultTemp", "22.1", "FLOAT"
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "defaultTemp"
        )`
      );
}

export default InitializeDB;
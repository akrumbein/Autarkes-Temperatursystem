const InitializeDB = async (
  db
) => {
    /*db.exec(
        `DROP TABLE ROOMS`
      );*/
      
    db.exec(
        `CREATE TABLE IF NOT EXISTS ROOMS 
        (
          id INTEGER AUTONINCREMENT PRIMARY KEY, 
          label TEXT,
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
          id INTEGER AUTONINCREMENT PRIMARY KEY, 
          value NUMERIC,
          type TEXT,
          timestamp DATETIME,
          roomId INTEGER
          )`
      );
      db.exec(
        `CREATE TABLE IF NOT EXISTS Configuration
        (
          key TEXT PRIMARY KEY, 
          value TEXT
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value)
        SELECT "defaultCarbon", 1000
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "defaultCarbon"
        )`
      );

      db.exec(
        `INSERT INTO Configuration (key, value)
        SELECT "measureInterval", 1000
        WHERE NOT EXISTS (
          SELECT 1 
          FROM Configuration 
          WHERE key = "measureInterval"
        )`
      );
}

export default InitializeDB;
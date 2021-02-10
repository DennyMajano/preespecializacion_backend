const util = require("util");
const mysql = require("mysql");

module.exports = {
  makeDb: () => {
    const connection = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_SERVER,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_DATA_BASE,
      connectTimeout: 1000,
    });
    connection.getConnection((err, connection) => {
      if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
          console.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
          console.error("Database connection was refused.");
        }
      }
      //Para cerrar cada conexion despues de usarla
      if (connection) connection.release();

      return;
    });

    if (process.env.MODE === "development") {
      setInterval(async () => {
        let teste = await connection.query("SELECT 1");
        console.log(teste);
      }, 5000);
    }
    return {
      query(sql, args) {
        return util.promisify(connection.query).call(connection, sql, args);
      },
      //no se usa
      close() {
        return util.promisify(connection.releaseConnection).call(connection);
      },
      //no se usa
      beginTransaction() {
        return util.promisify(connection.beginTransaction).call(connection);
      },
      //no se usa
      commit() {
        return util.promisify(connection.commit).call(connection);
      },
      //no se usa
      rollback() {
        return util.promisify(connection.rollback).call(connection);
      },
    };
  },
  async Transaction(db, callback) {
    try {
      await db.query("START TRANSACTION");
      await callback();
      await db.query("COMMIT");
      return db.query("COMMIT");
    } catch (err) {
      return err;
    }
  },

  testConection: mysql.createConnection(
    {
      host: process.env.DB_SERVER,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_DATA_BASE,
    },
    "single"
  ),
};

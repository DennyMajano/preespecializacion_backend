const util = require("util");
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATA_BASE,
  connectTimeout: 1000,
});

const conection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      console.log("MySQL pool connected: threadId " + connection.threadId);
      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ query, release });
    });
  });
};
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
module.exports = {
  makeDB: () => {
    return 0;
  },
  pool,

  conection,
  query,
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
};

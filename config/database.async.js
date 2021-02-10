module.exports = {
  async Transaction(db, callback) {
    const conection = await db.connection();
    try {
      await conection.query("START TRANSACTION");
      await conection.query("SET GLOBAL lc_time_names = 'es_SV';");
      await callback();
      await conection.query("COMMIT");
      return conection.query("COMMIT");
    } catch (err) {
      return err;
    } finally {
      await conection.release();
    }
  },
};

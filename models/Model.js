const database = require("../config/database.async");
const dbConnection = require("../config/conexion");

module.exports = {
  /**
   *
   * @param {*} bodyCallback las instrucciones que se ejecutarán dentro de la transaccion. Esta función debe tener un `return` del resultado de las operaciones de las queries ejecutadas
   * @returns el `return` de la ultima operacion `dbConnection.query`
   */
  multipleTransactionQuery: async (
    bodyCallback = async (dbConnection) => {}
  ) => {
    try {
      let result; //Variable para almacenar el resultado
      //Todo se va a ejecutar en una transaccion
      const transactionResult = await database.Transaction(
        dbConnection,
        async () => {
          //El cuerpo se pasa por una funcion y se ejecuta
          result = bodyCallback(dbConnection); //Se asigna a la variable que almacena el resultado
        }
      );

      //Una vez realizada la transacción se verifica si la transaccion devolvio un error
      if (transactionResult.errno || transactionResult instanceof Error) {
        throw transactionResult; //Si devolvio un error se manda al catch
      }
      return result; //Si no hay errores se devuelve el resultado de las operaciones
    } catch (error) {
      return error; //Si desde los procedimiento se paso al catch por un error se devuelve este error.
    }
  },
  //Base
  simpleTransactionQuery: async (
    sqlQuery,
    params,
    callback = async (queryResult) => {
      return queryResult;
    }
  ) => {
    try {
      let result;
      const transactionResult = await database.Transaction(dbConnection, async () => {
        //cosas
        const queryResult = await dbConnection.query(sqlQuery, params);

        result = await callback(queryResult);
      });

      if (transactionResult.errno || transactionResult instanceof Error) {
        throw transactionResult;
      }
      return result;
    } catch (error) {
      return error;
    }
  },
  connection: dbConnection
};

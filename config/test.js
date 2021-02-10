const mysql = require("../util/mysql.js");
const errors = require("../util/errors");
const crypto = require("crypto");
async function querySignUp(data) {
    const connection = await mysql.connection();

    try {
        console.log("at querySignUp...");
        await connection.query("START TRANSACTION");
        let usernameNo = await connection.query("SELECT COUNT (*) FROM user_table WHERE user_name = ?", [data.username]);
        if (usernameNo[0]["COUNT (*)"] > 0) {
            throw errors.usernameTakenError;
        };
        let emailNo = await connection.query("SELECT COUNT (*) FROM user_table WHERE email = ?", [data.email]);
        if (emailNo[0]["COUNT (*)"] > 0) {
            throw errors.userEmailTakenError;
        };
        let now = Date.now();
        let hash = crypto.createHash("sha256");
        hash.update(data.email + data.password + now);
        let token = hash.digest("hex");
        // encrypt password
        let passwordHash = crypto.createHash("sha256");
        passwordHash.update(data.password);
        let encryptedPassword = passwordHash.digest("hex");
        let userInfo = {
            user_name: data.username,
            user_password: encryptedPassword,
            email: data.email,
            provider: "native",
            access_expired: now + 30 * 24 * 60 * 60 * 1000, // 30 days
            token,
            points: 0,
            level_id: 1
        };
        await connection.query("INSERT INTO user_table SET ?", userInfo);
        let getUserInfo = await connection.query("SELECT user_table.*, level_table.level_name FROM user_table INNER JOIN level_table ON user_table.level_id = level_table.id WHERE user_table.email = ?", [data.email]);
        await connection.query("COMMIT");
        return userInfo;
    } catch (err) {
        await connection.query("ROLLBACK");
        console.log('ROLLBACK at querySignUp', err);
        throw err;
    } finally {
        await connection.release();
    }
}
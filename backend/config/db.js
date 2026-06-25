const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
import mysql from 'mysql2/promise';

let connect;
try {
    connect = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
    })

    console.log(DB_NAME + ` sql database Connected Successfully`)
} catch (err) {
    console.error(`Database connection failed Error: ${err}`)
}
export { connect }


'use strict';
const logger = require('../modules/logger')('MySQL Connection');

const mysql = require('mysql2/promise');
const config = require('../config');
const dbConfig = config.db;

var pool;
const sqlOptions = {
    connectionLimit: 20, //important
    host: dbConfig.db_host,
    user: dbConfig.db_user,
    password: dbConfig.db_password,
    database: dbConfig.db_name,
    port: dbConfig.db_port,
    multipleStatements: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    waitForConnections: true,
    // debug: true
}

try {
    pool = mysql.createPool(sqlOptions);
} catch (error) {
    logger.error("Connection Pool Error : ", error);
}

// pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.');
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.');
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.');
//         }
//     }

//     if (connection) {
//         logger.info("MYSQL connection established");
//         connection.release();
//     }

//     return;
// });

module.exports = pool;
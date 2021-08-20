

'use strict';
const logger = require('../modules/logger')('User Model');
var db = require('../db/db_bridge');
const config = require('../config');
const table = config.usersTable
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 *   User Model
 */
var userDataModel = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                    id int(11) NOT NULL AUTO_INCREMENT,
                                    username varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    password varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    sec_key varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    user_type int(11) NOT NULL,
                                    PRIMARY KEY(id)
                                  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating user table");
        }

        query = db.queryFormat(`SELECT * FROM ${table}`);
        queryRes = await db.query(query);
        if (!queryRes) {
          return reject("Error in querying settings, This can be ignored");
        }

        if (queryRes.length === 0) {
          let username = "admin"
          let password = "password"

          bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) {
              logger.error("Error in password Encryption, While registering default user");
            } else {
              password = hash
              query = db.queryFormat(`INSERT INTO ${table}
                                      (username,password,sec_key,user_type)
                                      VALUES (?, ?, ?, ?)`, [username, password, '010102', 1]);
              queryRes = await db.query(query, true);
              if (!queryRes) {
                return reject("Error while filling entry in table");
              }
              return resolve(true);
            }
          });
        } else {
          return resolve(true);
        }
      } catch (error) {
        logger.error("error in createTheTableIfNotExists->", error);
        reject(error)
      }
    });
  },

  /**
   * get all the user data form the table
   */
  getUserDataByUsername: function (username) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!username) return reject("Username is not provided");

        let query = db.queryFormat(`SELECT * FROM ${table} WHERE username = ?`, [username]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Username dont Exist");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in getallTableData->", error);
        reject(error)
      }
    });
  },

  /**
* get list of all admins
*/
  getListOfAdmins: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT id,username FROM ${table}`);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("no data found");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in getListOfAdmins->", error);
        reject(error)
      }
    });
  },

  /**
 * Insert a new user
 */
  insertNewUser: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.username) return reject("Username is not provided");
        if (!dataObj.password) return reject("Password is not provided");
        let currentEpoc = Math.floor(Date.now() / 1000)

        let query = db.queryFormat(`INSERT INTO ${table} (username, password, sec_key, user_type) VALUES (?, ?, ?, ?)`, [dataObj.username, dataObj.password, currentEpoc, dataObj.admintype]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in insertion");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in insertNewUser->", error);
        reject(error)
      }
    });
  },

  /**
 * Insert a new user
 */
  updateUserpassword: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.id) return reject("id is not provided");
        if (!dataObj.username) return reject("username is not provided");
        if (!dataObj.password) return reject("Password is not provided");
        let currentEpoc = Math.floor(Date.now() / 1000)

        let query = db.queryFormat(`UPDATE ${table} SET password = ?, sec_key = ? WHERE id = ? AND username = ?`, [dataObj.password, currentEpoc, dataObj.id, dataObj.username]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in Update");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in updateUserpassword->", error);
        reject(error)
      }
    });
  },

  /**
* Delete a  user
*/
  deleteUser: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.id) return reject("id is not provided");
        if (!dataObj.username) return reject("username is not provided");

        let query = db.queryFormat(`DELETE FROM ${table} WHERE id = ? AND username = ?`, [dataObj.id, dataObj.username]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in delete");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in deleteUser->", error);
        reject(error)
      }
    });
  },

}

module.exports = userDataModel;
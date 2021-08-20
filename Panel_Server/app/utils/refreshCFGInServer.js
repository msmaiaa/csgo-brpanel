

"use strict";
const logger = require('../modules/logger')('refresh CGF');
const Rcon = require('rcon');
const SourceQuery = require('sourcequery');
const panelServerModal = require("../models/panelServerModal.js");

//-----------------------------------------------------------------------------------------------------
// 

const refreshAdminsInServer = (server) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverDetails = await panelServerModal.getPanelServerDetails(server)

      if (serverDetails.server_ip && serverDetails.server_port && serverDetails.server_rcon_pass) {

        let sq = new SourceQuery(1000); // 1000ms timeout
        sq.open(serverDetails.server_ip, serverDetails.server_port);
        sq.getInfo(function (err, info) {
          if (err) {
            sq.close()
            //return reject("Operation Done in VMPanel Database,\n No Rcon execution, Server is Offline ")
            return resolve(0)
          } else {
            sq.close()
            var conn = new Rcon(serverDetails.server_ip, serverDetails.server_port, serverDetails.server_rcon_pass);
            conn.on('auth', function () {
              logger.info("*** Rcon Authorized! ***");
              conn.send("sm_vipRefresh");
              conn.disconnect();
            }).on('response', function (str) {
              logger.info("*** [RCON] Got response: " + str);
            }).on('error', function (error) {
              logger.error("*** [RCON] Got error: " + error);
              return reject("Operation Done in VMPanel Database,\n There was an error while executing rcon Command for current Operation. ")
            }).on('end', function () {
              logger.info("*** [RCON] Socket closed!");
              resolve(1)
            });
            conn.connect();
          }
        });
      } else {
        resolve(0)
      }
    } catch (error) {
      logger.error("error in refreshAdminsInServer->", error)
      reject("Operation Done in VMPanel Database,\n There was an error while executing rcon Command for current Operation. ")
    }
  });
}

exports.refreshAdminsInServer = refreshAdminsInServer;

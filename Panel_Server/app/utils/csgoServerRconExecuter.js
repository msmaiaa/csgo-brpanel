

'use strict';
const logger = require('../modules/logger')('cs go rcon');
const Rcon = require('rcon');
const SourceQuery = require('sourcequery');
const panelServerModal = require("../models/panelServerModal.js");

//-----------------------------------------------------------------------------------------------------
// 

const executeRconInServer = (server,commandString) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverDetails = await panelServerModal.getPanelServerDetails(server)

      if (serverDetails.server_ip && serverDetails.server_port && serverDetails.server_rcon_pass) {

        let sq = new SourceQuery(1000); // 1000ms timeout
        sq.open(serverDetails.server_ip, serverDetails.server_port);
        sq.getInfo(function (err, info) {
          if (err) {
            sq.close()
            return reject("Can not proceed with the Operation, Server is Offline ")
          } else {
            sq.close()
            var conn = new Rcon(serverDetails.server_ip, serverDetails.server_port, serverDetails.server_rcon_pass);
            conn.on('auth', function () {
              logger.info("*** Rcon Authorized! ***");
              conn.send(commandString);
              conn.disconnect();
            }).on('response', function (str) {
              logger.info("*** [RCON] Got response: " + str);
            }).on('error', function (error) {
              logger.error("*** [RCON] Got error: " + error);
              return reject("Can not proceed with the Operation, There was an error while making RCON Connection to Server ")
            }).on('end', function () {
              logger.info("*** [RCON] Socket closed!");
              resolve(1)
            });
            conn.connect();
          }
        });
      } else {
        reject("Can not proceed with the Operation, Server details are missing in Database ")
      }
    } catch (error) {
      logger.error("error in executeRconInServer->", error)
      reject("Operation Failed, There was an error while executing RCON Commands in Server. ")
    }
  });
}

exports.executeRconInServer = executeRconInServer;

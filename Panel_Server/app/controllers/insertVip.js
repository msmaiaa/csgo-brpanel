

'use strict';
const logger = require('../modules/logger')('Insert VIP controller');
const vipModel = require("../models/vipModel.js");
const userModel = require("../models/userModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const { logThisActivity } = require("../utils/activityLogger.js");
var rconStatus = []

//-----------------------------------------------------------------------------------------------------
// 

exports.formVIP = async (req, res) => {
  try {
    let serverList = await panelServerModal.getPanelServersDisplayList();
    res.render('ManageVIP', { "serverList": serverList });
  } catch (error) {
    logger.error("error in formVIP-->", error);
    res.render('ManageVIP', { "serverList": null });
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.insertVipData = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await insertVipDataFunc(req.body, req.session.username);
    logThisActivity({
      "activity": req.body.submit == "insert" ? "Novo VIP adicionado" : "VIP atualizado",
      "additional_info": `${(req.body.name) ? req.body.name.replace("//", "") : "-_-"} ( ${req.body.steamId} )`,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": req.body.submit == "insert" ? "Novo VIP adicionado com sucesso" + (rconStatus.includes(0) ? ", RCON não executado em todos os servidores" : ", RCON executado em todos os servidores") :
          "VIP Updated Successfully" + (rconStatus.includes(0) ? ", RCON não executado em todos os servidores" : ", RCON executado em todos os servidores"),
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in add/update vip->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const insertVipDataFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        reqBody.day = reqBody.day / 1
        if (reqBody.submit === "insert") {

          //validations
          if (!reqBody.steamId) return reject("Operação falhou!, Steam Id faltando");
          if (!reqBody.name) return reject("Operação falhou!, Nome faltando");
          if (!reqBody.flag) return reject("Operação falhou!, Flags faltando");
          if (!reqBody.day) return reject("Operação falhou!, Numero de dias faltando");
          if (!reqBody.server) return reject("Operação falhou!, lista de servidores faltando");

          let serverList = reqBody.server
          if (!Array.isArray(serverList)) return reject("Operação falhou!, lista de servidores is not an Array");
          let allServersList = await panelServerModal.getPanelServersDisplayList();
          let serverListLength
          if (serverList.length <= allServersList.length) {
            serverListLength = serverList.length
          } else {
            return reject("Length of given lista de servidores is more then max servers added in panel, something is fishy");
          }

          reqBody.day = epochTillExpiry(reqBody.day);
          reqBody.name = "//" + reqBody.name;
          reqBody.steamId = '"' + reqBody.steamId + '"';
          reqBody.userType = 0;

          let insertRes = await vipModel.insertVIPData(reqBody)
          if (insertRes) {
            for (let i = 0; i < serverListLength; i++) {
              let result = await refreshAdminsInServer(serverList[i]);
              rconStatus.push(result)
            }
            resolve(insertRes)
          }
        } else if (reqBody.submit === "update") {

          //validations
          if (!reqBody.steamId) return reject("Operação falhou!, Steam Id faltando");
          if (!reqBody.day) return reject("Operação falhou!, número de dias faltando");
          if (!reqBody.server) return reject("Operação falhou!, lista de servidores faltando");

          let serverList = reqBody.server
          if (!Array.isArray(serverList)) return reject("Operação falhou!, lista de servidores is not an Array");
          let allServersList = await panelServerModal.getPanelServersDisplayList();
          let serverListLength
          if (serverList.length <= allServersList.length) {
            serverListLength = serverList.length
          } else {
            return reject("Length of given lista de servidores is more then max servers added in panel, something is fishy");
          }

          reqBody.day = Math.floor(reqBody.day * 86400);
          reqBody.steamId = '"' + reqBody.steamId + '"';

          let updateRes = await vipModel.updateVIPData(reqBody)
          if (updateRes) {
            for (let i = 0; i < serverListLength; i++) {
              let result = await refreshAdminsInServer(serverList[i]);
              rconStatus.push(result)
            }
            resolve(updateRes)
          }
        } else {
          reject("Algo deu errado")
        }
      } else {
        reject("Acesso não autorizado, key faltando")
      }
    } catch (error) {
      logger.error("error in insertVipDataFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.insertVipDataFunc = insertVipDataFunc;
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
// 

function epochTillExpiry(days) {
  let currentEpoch = Math.floor(Date.now() / 1000)
  let daysInSec = Math.floor(days * 86400)
  return (currentEpoch + daysInSec)
}
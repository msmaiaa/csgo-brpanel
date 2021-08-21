

'use strict';
const logger = require('../modules/logger')('Insert Admin Controller');

const userModel = require("../models/userModel.js");
const vipModel = require("../models/vipModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const { logThisActivity } = require("../utils/activityLogger.js");
var rconStatus = []

//-----------------------------------------------------------------------------------------------------
// 

exports.formAdmin = async (req, res) => {
  try {
    let serverList = await panelServerModal.getPanelServersDisplayList();
    res.render('ManageAdmin', { "serverList": serverList });
  } catch (error) {
    res.render('ManageAdmin', { "serverList": null });
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.insertAdminData = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await insertAdminDataFunc(req.body, req.session.username);
    logThisActivity({
      "activity": "Novo admin adicionado",
      "additional_info": `${req.body.name.replace("//", "")} ( ${req.body.steamId} )`,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "Novo admin adicionado com sucesso" + (rconStatus.includes(0) ? ", RCON não executado em todos os servidores" : ", RCON executado em todos os servidores"),
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in add Admin->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const insertAdminDataFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {

          //validations
          if (!reqBody.steamId) return reject("Operação falhou!, Steam Id faltando");
          if (!reqBody.name) return reject("Operação falhou!, Nome faltando");
          if (!reqBody.flag) return reject("Operação falhou!, Flags faltando");
          if (!reqBody.server) return reject("Operação falhou!, lista de servidores faltando");

          let serverList = reqBody.server
          if (!Array.isArray(serverList)) return reject("Operação falhou!, lista de servidores não é um array");
          let allServersList = await panelServerModal.getPanelServersDisplayList();
          let serverListLength
          if (serverList.length <= allServersList.length) {
            serverListLength = serverList.length
          } else {
            return reject("Length of given lista de servidores is more then max servers added in panel, something is fishy");
          }

          reqBody.name = "//" + reqBody.name;
          reqBody.steamId = '"' + reqBody.steamId + '"';
          reqBody.day = 0;
          reqBody.userType = 1;

          let insertRes = await vipModel.insertVIPData(reqBody)
          if (insertRes) {
            for (let i = 0; i < serverListLength; i++) {
              let result = await refreshAdminsInServer(serverList[i]);
              rconStatus.push(result)
            }
            resolve(insertRes)
          }
        }
      } else {
        reject("Acesso não autorizado, Key faltando")
      }
    } catch (error) {
      logger.error("error in insertAdminDataFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.insertAdminDataFunc = insertAdminDataFunc;

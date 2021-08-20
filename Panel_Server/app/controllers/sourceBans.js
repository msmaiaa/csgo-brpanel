

'use strict';
const logger = require('../modules/logger')('Source Bans');

const panelServerModal = require("../models/panelServerModal.js");
const { executeRconInServer } = require("../utils/csgoServerRconExecuter")
const { logThisActivity } = require("../utils/activityLogger.js");
const userModel = require("../models/userModel.js");

var rconStatus = []

//-----------------------------------------------------------------------------------------------------
// 

exports.sourceBans = async (req, res) => {
  try {
    let serverList = await panelServerModal.getPanelServersDisplayList();
    res.render('sourceBans', { "serverList": serverList });
  } catch (error) {
    logger.error("error in sourceBans-->", error);
    res.render('sourceBans', { "serverList": null });
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.sourceBansAddBan = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await sourceBansAddBanFunc(req.body, req.session.username);
    logThisActivity({
      "activity": req.body.bantype == "serverBan" ? "New Server Ban Added" : "New Comm Ban Added",
      "additional_info": (req.body.bantype == "serverBan" ?
        `${req.body.username} (${req.body.steamid}) banned for ${req.body.banlength} Minutes` :
        `${req.body.username} (${req.body.steamid}) Comm Banned for ${req.body.banlength} Minutes`),
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": req.body.bantype == "serverBan" ? "Server Ban added Successfully" : "Comm Ban added Successfully",
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in adding ban in sourceBansAddBan->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const sourceBansAddBanFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {

        logger.info("req body in  sourceBansAddBanFunc==> ", reqBody);

        if (reqBody.bantype === "serverBan") {
          if (reqBody.serverbantype == "steamid") {
            const banCommand = `sm_addban ${reqBody.banlength} ${reqBody.steamid} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else {
            return reject("Wrong ban type passed in API")
          }
        } else if (reqBody.bantype === "commBan") {

          if (reqBody.commbantype == "chatonly") {
            const banCommand = `sm_gag #${reqBody.steamid}|${reqBody.username} ${reqBody.banlength} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else if (reqBody.commbantype == "voiceonly") {
            const banCommand = `sm_mute #${reqBody.steamid}|${reqBody.username} ${reqBody.banlength} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else if (reqBody.commbantype == "chatandvoice") {
            const banCommand = `sm_unsilence #${reqBody.steamid}|${reqBody.username} ${reqBody.banlength} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else {
            return reject("Wrong ban type passed in API")
          }
        } else {
          return reject("Wrong ban type passed in API")
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      logger.error("error in sourceBansAddBanFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.sourceBansAddBanFunc = sourceBansAddBanFunc;
//-----------------------------------------------------------------------------------------------------

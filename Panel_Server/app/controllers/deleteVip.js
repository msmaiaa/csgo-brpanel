

'use strict';
const logger = require('../modules/logger')('Delete VIP controller');
const vipModel = require("../models/vipModel.js");
const userModel = require("../models/userModel.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const { logThisActivity } = require("../utils/activityLogger.js");
var rconStatus

//-----------------------------------------------------------------------------------------------------
// 

exports.deleteVipData = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await deleteVipDataFunc(req.body, req.session.username);
    logThisActivity({
      "activity": "VIP deleted",
      "additional_info": req.body.primaryKey,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "VIP deleted Successfully" + (rconStatus ? ", RCON Executed" : ", RCON Not Executed"),
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in delete vip->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deleteVipDataFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        reqBody.primaryKey = '"' + reqBody.primaryKey + '"'
        let deleteRes = await vipModel.deleteVipByAdmin(reqBody)
        if (deleteRes) {
          rconStatus = await refreshAdminsInServer(reqBody.tableName);
          resolve(deleteRes)
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }

    } catch (error) {
      logger.error("error in deleteVipDataFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.deleteVipDataFunc = deleteVipDataFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deleteOldVipData = async (req, res) => {
  try {

    let result = await deleteOldVipDataFunc(req.session.username, req.session.sec_key);
    logThisActivity({
      "activity": "Manual Refresh Executed",
      "additional_info": "Old VIPs and deleted and new data is updated in servers",
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "Operation Successfully Executed",
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in delete vip->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deleteOldVipDataFunc = (username, secKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await userModel.getUserDataByUsername(username)

      if (secKey && secKey === userData.sec_key) {

        let deleteRes = await vipModel.deleteOldVip()
        if (deleteRes) {
          resolve(deleteRes)
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      logger.error("error in deleteOldVipDataFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.deleteOldVipDataFunc = deleteOldVipDataFunc;
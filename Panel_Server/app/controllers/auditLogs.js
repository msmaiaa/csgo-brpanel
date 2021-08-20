

'use strict';
const logger = require('../modules/logger')('Audit Logs Controller');

const auditModal = require("../models/auditLogsModel.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.auditRecords = async (req, res) => {
  try {
    if (req.session.user_type == 1) {
      res.render('PanelAuditLogs');
    } else {
      res.redirect('dashboard');
    }
  } catch (error) {
    logger.error("error in auditRecords-->", error);
    if (req.session.user_type == 1) {
      res.render('PanelAuditLogs');
    } else {
      res.redirect('dashboard');
    }
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getAuditRecord = async (req, res) => {
  try {
    if (req.session.user_type == 1) {
      let result = await getAuditRecordFunc(req.body);
      res.json({
        success: true,
        data: { "res": result, "message": "Audit Logs Fetched" }
      });
    } else {
      return reject("You don't have permissions to access records")
    }
  } catch (error) {
    logger.error("error in getAuditRecord->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getAuditRecordFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let salesRecord = await auditModal.getAllAuditRecords(reqBody)
      resolve(salesRecord)
    } catch (error) {
      logger.error("error in getAuditRecordFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.getAuditRecordFunc = getAuditRecordFunc;
//-----------------------------------------------------------------------------------------------------
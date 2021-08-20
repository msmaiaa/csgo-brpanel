

'use strict';
const logger = require('../modules/logger')('Activity Logger');
const auditModal = require("../models/auditLogsModel.js");

//-----------------------------------------------------------------------------------------------------
// 

const logThisActivity = (activityObject) => {
  try {

    // validation
    if (!activityObject.activity) return reject("Activity can't be null");
    if (!activityObject.created_by) return reject("Created by can't be null");

    auditModal.insertNewAuditRecord(activityObject)
  } catch (error) {
    logger.error("error in activity logger->", error);
  }
}

exports.logThisActivity = logThisActivity;

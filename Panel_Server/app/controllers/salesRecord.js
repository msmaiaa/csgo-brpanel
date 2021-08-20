

'use strict';
const logger = require('../modules/logger')('Sales Record Controller');
const salesModal = require("../models/salesModel.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.saleRecords = async (req, res) => {
  try {
    if (req.session.user_type == 1) {
      res.render('SaleRecords');
    } else {
      res.redirect('dashboard');
    }
  } catch (error) {
    logger.error("error in saleRecords-->", error);
    if (req.session.user_type == 1) {
      res.render('SaleRecords');
    } else {
      res.redirect('dashboard');
    }
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getSalesRecord = async (req, res) => {
  try {
    if (req.session.user_type == 1) {
      let result = await getSalesRecordFunc(req.body);
      res.json({
        success: true,
        data: { "res": result, "message": "Sale Records Fetched" }
      });
    } else {
      return reject("You don't have permissions to access records")
    }
  } catch (error) {
    logger.error("error in getSalesRecord->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getSalesRecordFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let salesRecord = await salesModal.getAllSalesRecords(reqBody)
      resolve(salesRecord)
    } catch (error) {
      logger.error("error in getSalesRecordFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.getSalesRecordFunc = getSalesRecordFunc;
//-----------------------------------------------------------------------------------------------------
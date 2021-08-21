

'use strict';
const logger = require('../modules/logger')('Panel Server Bundles Controller');
const userModel = require("../models/userModel.js");
const bundleModel = require("../models/bundleModel.js");
const { logThisActivity } = require("../utils/activityLogger.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelServerBundle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await addPanelServerBundleFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Novo bundle de servidor adicionado no painel",
      "additional_info": req.body.bundlename,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": "Novo bundle de servidor adicionado no painel" }
    });
  } catch (error) {
    logger.error("error in addPanelServerBundle->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const addPanelServerBundleFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      // validation
      if (reqBody.bundleserverarray < 2) return reject("Operação falhou!, Selecione ao menos 2 servidores para criar um bundle");
      if (!reqBody.bundlename) return reject("Operação falhou!, nome do bundle está faltando");
      if (!reqBody.bundleprice) return reject("Operação falhou!, preço do bundle está faltando");
      if (!reqBody.bundlecurrency) return reject("Operação falhou!, moeda do bundle está faltando");
      if (!reqBody.bundlesubdays) return reject("Operação falhou!, dias de assinatura do bundle estão faltando");
      if (!reqBody.bundlevipflag) return reject("Operação falhou!, flags de vip do bundle está faltando");

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {
          let insertRes = await bundleModel.insertNewPanelBundle(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        }
      } else {
        reject("Acesso não autorizado, key está faltando.")
      }
    } catch (error) {
      logger.error("error in addPanelServerBundleFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.addPanelServerBundleFunc = addPanelServerBundleFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelBundlesList = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await getPanelBundlesListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Lista de bundles recuperada" }
    });
  } catch (error) {
    logger.error("error in getPanelBundlesList->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelBundlesListFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverData = await bundleModel.getAllBundles()
      resolve(serverData)

    } catch (error) {
      logger.error("error in getPanelBundlesListFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.getPanelBundlesListFunc = getPanelBundlesListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelBundle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await deletePanelBundleFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Bundle deletado do painel",
      "additional_info": req.body.bundlename,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": "Bundle deletado com sucesso" }
    });
  } catch (error) {
    logger.error("error in deletePanelBundle->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deletePanelBundleFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      // validation
      if (!reqBody.bundlename) return reject("Operação falhou!, está faltando o nome do bundle");
      if (!reqBody.id) return reject("Operação falhou!, está faltando o id");

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "delete") {
          let deleteRes = await bundleModel.deletePanelBundle(reqBody)
          if (deleteRes) {
            resolve(deleteRes)
          }
        }
      } else {
        reject("Acesso não autorizado, key está faltando.")
      }
    } catch (error) {
      logger.error("error in deletePanelBundleFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.deletePanelBundleFunc = deletePanelBundleFunc;



'use strict';
const logger = require('../modules/logger')('Panel Servers Controller');
const userModel = require("../models/userModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const { logThisActivity } = require("../utils/activityLogger.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelServer = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await addPanelServerFunc(req.body, req.session.username);

    logThisActivity({
      "activity": req.body.submit === "insert" ? "Novo servidor adicionado ao painel" : "Servidor do painel atualizado",
      "additional_info": req.body.servername,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": req.body.submit === "insert" ? "Novo servidor adicionado com sucesso" : "Dados do servidor adicionados com sucesso" }
    });
  } catch (error) {
    logger.error("error in addPanelServer->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const addPanelServerFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      // validation
      if (!reqBody.tablename) return reject("Operação falhou!, nome da tabela faltando");
      if (!reqBody.servername) return reject("Operação falhou!, nome do servidor faltando");

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {
          let insertRes = await panelServerModal.insertNewPanelServer(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        } else if (reqBody.submit === "update") {
          let updateRes = await panelServerModal.updatePanelServer(reqBody)
          if (updateRes) {
            resolve(updateRes)
          }
        }
      } else {
        reject("Acesso não autorizado, key faltando")
      }
    } catch (error) {
      logger.error("error in addPanelServerFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.addPanelServerFunc = addPanelServerFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelServersList = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await getPanelServersListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Lista de servidores encontrada" }
    });
  } catch (error) {
    logger.error("error in getPanelServersList->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelServersListFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverData = await panelServerModal.getPanelServersList()
      if (serverData) {
        for (let i = 0; i < serverData.length; i++) {
          serverData[i].server_rcon_pass = serverData[i].server_rcon_pass ? "Disponível" : "NA"
        }
        resolve(serverData)
      }
    } catch (error) {
      logger.error("error in getPanelServersListFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.getPanelServersListFunc = getPanelServersListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelServerSingle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await getPanelServerSingleFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Dados dos servidores encontrados" }
    });
  } catch (error) {
    logger.error("error in getPanelServerSingle->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelServerSingleFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverData = await panelServerModal.getPanelServerDetails(reqBody.server)
      resolve(serverData)
    } catch (error) {
      logger.error("error in getPanelServerSingleFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.getPanelServerSingleFunc = getPanelServerSingleFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelServers = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await deletePanelServersFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Panel Server Deleted",
      "additional_info": req.body.tablename,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": "Servidor deletado com sucesso" }
    });
  } catch (error) {
    logger.error("error in deletePanelServers->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deletePanelServersFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      // validation
      if (!reqBody.tablename) return reject("Operação falhou!, nome da tabela faltando");
      if (!reqBody.id) return reject("Operação falhou!, id faltando");

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "delete") {
          let insertRes = await panelServerModal.deletePanelServer(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        }
      } else {
        reject("Acesso não autorizado, key faltando")
      }
    } catch (error) {
      logger.error("error in deletePanelServersFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.deletePanelServersFunc = deletePanelServersFunc;



'use strict';
const logger = require('../modules/logger')('Panel Admins Controller');
const userModel = require("../models/userModel.js");
const { logThisActivity } = require("../utils/activityLogger.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelAdmin = async (req, res) => {
  try {
    if (req.session.user_type === 0) {
      logThisActivity({
        "activity": "Acesso não autorizado",
        "additional_info": "Alguém tentou acessar o painel de admin",
        "created_by": req.session.username ? req.session.username : "NA"
      })
      throw "Acesso não autorizado, você não é um Super Admin"
    }

    req.body.secKey = req.session.sec_key
    let result = await addPanelAdminFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Novo admin de painel adicionado",
      "additional_info": req.body.username,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: { "res": result, "message": req.body.submit == "insert" ? "Novo admin adicionado com sucesso" : "Admin atualizado com sucesso", "notifType": "success" }
    });
  } catch (error) {
    logger.error("error in addPanelAdmin->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const addPanelAdminFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getUserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {

          //validations
          if (!reqBody.username) return reject("Operação falhou!, Nome faltando");
          if (!reqBody.password) return reject("Operação falhou!, Senha faltando");

          bcrypt.hash(reqBody.password, saltRounds, async function (err, hash) {
            if (err) {
              return reject("Erro na encriptação da senha, tente novamente")
            } else {
              reqBody.password = hash
              let insertRes = await userModel.insertNewUser(reqBody)
              if (insertRes) {
                resolve(insertRes)
              }
            }
          });

        } else if (reqBody.submit === "update") {

          //validations
          if (!reqBody.username) return reject("Operação falhou!, Nome faltando");
          if (!reqBody.newpassword) return reject("Operação falhou!, Senha faltando");

          bcrypt.hash(reqBody.newpassword, saltRounds, async function (err, hash) {
            if (err) {
              return reject("Erro na encriptação da senha, tente novamente")
            } else {
              reqBody.newpassword = hash
              let updateRes = await userModel.updateUserpassword({
                "id": reqBody.username.split(':')[0],
                "username": reqBody.username.split(':')[1],
                "password": reqBody.newpassword
              })
              if (updateRes) {
                resolve(updateRes)
              }
            }
          });
        }
      } else {
        reject("Acesso não autorizado, key faltando")
      }
    } catch (error) {
      logger.error("error in addPanelAdminFunc->", error);
      reject(error + ", Por favor tente novamente")
    }
  });
}

exports.addPanelAdminFunc = addPanelAdminFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelAdminsList = async (req, res) => {
  try {
    if (req.session.user_type === 0) { throw "Acesso não autorizado, você não é um super admin" }
    req.body.secKey = req.session.sec_key
    let result = await getPanelAdminsListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Lista de admins recuperada com sucesso" }
    });
  } catch (error) {
    logger.error("error in getPanelAdminsList->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelAdminsListFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getListOfAdmins()
      if (userData) {
        resolve(userData)
      }
    } catch (error) {
      logger.error("error in getPanelAdminsListFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.getPanelAdminsListFunc = getPanelAdminsListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelAdmin = async (req, res) => {
  try {
    if (req.session.user_type === 0) {
      logThisActivity({
        "activity": "Acesso não autorizado",
        "additional_info": "Alguém tentou deletar um admin do painel",
        "created_by": req.session.username ? req.session.username : "NA"
      })
      throw "Acesso não autorizado, você não é um super admin"
    }

    req.body.secKey = req.session.sec_key
    let result = await deletePanelAdminFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Admin do painel deletado!",
      "additional_info": req.body.username.split(':')[1],
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: { "res": result, "message": "Admin deletado com sucesso", "notifType": "success" }
    });
  } catch (error) {
    logger.error("error in deletePanelAdmin->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deletePanelAdminFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (reqBody.username.split(':')[1] == username) {
        reject("Did u really tried to delete yourself ?");
      } else {

        //validations
        if (!reqBody.username) return reject("Operação falhou!, Nome faltando");

        let userData = await userModel.getUserDataByUsername(username)

        if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
          if (reqBody.submit === "delete") {
            let insertRes = await userModel.deleteUser({
              "id": reqBody.username.split(':')[0],
              "username": reqBody.username.split(':')[1],
            })
            if (insertRes) {
              resolve(insertRes)
            }
          }
        } else {
          reject("Acesso não autorizado, key faltando")
        }
      }
    } catch (error) {
      logger.error("error in deletePanelAdminFunc->", error);
      reject(error + ", por favor tente novamente")
    }
  });
}

exports.deletePanelAdminFunc = deletePanelAdminFunc;

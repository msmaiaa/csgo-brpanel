

'use strict';
const logger = require('../modules/logger')('pay U controller');
const SteamIDConverter = require('../utils/steamIdConvertor')
const crypto = require('crypto');
const config = require('../config');
const payUConfig = config.payment_gateways.payU

//-----------------------------------------------------------------------------------------------------
// 

exports.initPayUPayment = async (req, res) => {
  try {
    const secKey = req.session.passport.user.id
    let result = await initPayUPaymentFunc(req.body, req.user, secKey);

    res.json({
      success: true,
      data: {
        "res": result,
        "message": "PayU initiated",
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

const initPayUPaymentFunc = (reqBody, reqUser, secKey) => {
  return new Promise(async (resolve, reject) => {
    try {

      const steamId = SteamIDConverter.toSteamID(reqUser.id);

      let productData = reqBody.serverData
      let productInfo = productData.vip_days + " days VIP for " + productData.server_name + (reqBody.type == 'newPurchase' ? " (New Buy)" : reqBody.type == 'renewPurchase' ? " (Renewal)" : "")

      let txnID = createTXNid()
      let successURL = ((config.apacheProxy) ? ('http://' + config.hostname) : ('http://' + config.hostname + ':' + config.serverPort)) + '/txnsuccesspayu'
      let errorURL = ((config.apacheProxy) ? ('http://' + config.hostname) : ('http://' + config.hostname + ':' + config.serverPort)) + '/txnerrorpayu'

      let crypt = crypto.createHash('sha512');
      let text = payUConfig.merchantKey + '|' + txnID + '|' + productData.vip_price + '|' + productInfo + '|' + reqBody.userFirstName + '|' + reqBody.userEmail + '|||||' + steamId + '||||||' + payUConfig.merchantSalt;
      crypt.update(text);
      let payUHash = crypt.digest('hex');

      let payuFormData = {
        "key": payUConfig.merchantKey,
        "txnid": txnID,
        "hash": payUHash,
        "amount": productData.vip_price,
        "firstname": reqBody.userFirstName,
        "email": reqBody.userEmail,
        "phone": reqBody.userMobile,
        "productinfo": productInfo,
        "udf5": steamId,
        "surl": successURL,
        "furl": errorURL
      }

      resolve(payuFormData)
    } catch (error) {
      logger.error("error in initPayUPaymentFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.initPayUPaymentFunc = initPayUPaymentFunc;
//-----------------------------------------------------------------------------------------------------

function createTXNid() {
  let txID = 'PAYUORD-'
  txID += randomString(2)
  const now = new Date()
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)
  txID += secondsSinceEpoch
  return txID
}

function randomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
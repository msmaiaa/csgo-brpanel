const config = require("../config/config.json")
const jwt = require('jsonwebtoken')
const db = require('../db/db_bridge');
const SteamIDConverter = require('../utils/steamIdConvertor')
const vipModel = require("../models/vipModel.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")

const stripe = require('stripe')(config.payment_gateways.stripe.api_key);
const YOUR_DOMAIN = 'http://' + config.hostname + ':3535';
const SUCCESS_CALLBACK_URL = `${YOUR_DOMAIN}`///api/stripeSuccess
const CANCEL_CALLBACK_URL = `${YOUR_DOMAIN}`//api/stripeCancel

const endpointSecret = config.payment_gateways.stripe.webhook_secret

function epochTillExpiry(days) {
  let currentEpoch = Math.floor(Date.now() / 1000)
  let daysInSec = Math.floor(days * 86400)
  return (currentEpoch + daysInSec)
}

const getBundleByName = async(name) => {
  try{
    const bundle_table = config.bundletable
    const query = db.queryFormat(`
    SELECT * FROM ${bundle_table} WHERE bundle_name='${name}'
    `)
    let queryRes = await db.query(query, true);
    return queryRes
  }catch(e) {
    console.error(e)
  }
}

exports.initStripePayment = async(req, res) => {
  try{
    const user = req.session.passport.user
    const type = req.body.type
    let sessionUrl = ''
    switch(type) {
      case 'newPurchaseBundle': {
        //need to integrate with sales logging
        const bundleInfo = await getBundleByName(req.body.bundleName)
        const parsedServersArray = req.body.serverData.tbl_name.split(',')

        const newToken = await jwt.sign({
          bundle: {
            name: bundleInfo.bundle_name,
            sub_days: bundleInfo.bundle_sub_days,
            flags: bundleInfo.bundle_flags
          },
          user: {
            steamid: SteamIDConverter.toSteamID(user.id),
            name: user._json.personaname ? user._json.personaname : user._json.displayName,
          },
          server: {
            tbl_name: parsedServersArray
          },
          type: "newPurchaseBundle"
        }, config.jwt.key)
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: bundleInfo.stripe_price_id,
              quantity: 1,
            },
          ],
          payment_method_types: [
            'boleto',
            'card',
          ],
          mode: 'payment',
          locale: 'pt-BR',
          success_url: SUCCESS_CALLBACK_URL,
          cancel_url: CANCEL_CALLBACK_URL ,
          metadata: {
            token: newToken
          }
        });
        sessionUrl = session.url
      }
      case 'renewPurchase': {
        //TODO
        // const newToken = await jwt.sign({
        //   bundle: {
        //     name: bundleInfo.bundle_name,
        //     sub_days: bundleInfo.bundle_sub_days,
        //     flags: bundleInfo.bundle_flags
        //   },
        //   steamid: SteamIDConverter.toSteamID(user.id),
        //   server: parsedServersArray
        // }, config.jwt.key)
        // console.log(req.body)
      }
    }
    res.status(200).json({url: sessionUrl})
  }catch(e) {
    console.error(e)
  }
}

const fulfillOrder = async (session) => {
  try{
    const decodedToken = jwt.decode(session.metadata.token, config.jwt.key)
    if(!decodedToken) return
    switch(decodedToken.type) {
      case 'newPurchaseBundle': {
        //this will add the user cargo if it doesn't exists, else it will add the days to the table
        for(server of decodedToken.server.tbl_name) {
          const hasVipOnServer = await vipModel.checkVipExists({server, steamId: '"' + decodedToken.user.steamid + '"'})
          if(hasVipOnServer) {
            await vipModel.updateVIPData({
              secKey: decodedToken.user.steamid,
              steamId: '"' + decodedToken.user.steamid + '"',
              day: Math.floor(decodedToken.bundle.sub_days * 86400),
              server: [server],
            })
          }else{
            await vipModel.insertVIPData({
              day: epochTillExpiry(decodedToken.bundle.sub_days),
              name: "//" + decodedToken.user.name,
              steamId: '"' + decodedToken.user.steamid + '"',
              userType: 0,
              flag: decodedToken.bundle.flags,
              server:[server],
              secKey: decodedToken.user.steamid
            })
          }
        }
        // if (insertRes) {
        //   for (let i = 0; i < newVipInsertObj.server.length; i++) {
        //     await refreshAdminsInServer(newVipInsertObj.server[i]);
        //   }
        // }
      }
      // case 'renewPurchase': {

      // }
    }
  }catch(e) {
    console.error(e)
  }
}

const createOrder = async (session) => {
  //not needed?
  console.log("Creating order");
}

const emailCustomerAboutFailedPayment = async (session) => {
  //TODO
  console.log("Emailing customer");
}

exports.stripeCancelCallback = async (req, res) => {
  try{
    console.log('Receiving stripe cancel callback')
    return res.status(200).json({
      received: true
    })
  }catch(e) {
    console.error(e)
  }
}

exports.stripeSuccessCallback = async (req, res) => {
  try{
    console.log('Receiving stripe success callback')
    return res.status(200).json({
      received: true
    })
  }catch(e) {
    console.error(e)
  }
}



exports.handleStripeWebhook = async(req, res) => {
  try{
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await createOrder(session);
        if (session.payment_status === 'paid') {
          await fulfillOrder(session);
        }
        break;
      }
  
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        await fulfillOrder(session);
  
        break;
      }
  
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        await emailCustomerAboutFailedPayment(session);
  
        break;
      }
    }
    
    //  Return a response to acknowledge receipt of the event
    return res.status(200).json({received: true})
  }catch(e) {
    console.error(e)
  }
}
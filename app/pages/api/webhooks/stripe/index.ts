import router from '../../../../lib/router'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma'
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2020-08-27'
})

export const config = {
  api: {
      bodyParser: false,
  },
};

const path = '/api/webhooks/stripe'
router.post(path, async(req, res) => {
  try{
    const buf = await buffer(req);
    const stripeSignature = req.headers["stripe-signature"]
    let event
    try{
      event = stripe.webhooks.constructEvent(buf, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET)
    }catch(err) {
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

    return res.status(200).json({
      received: true
    })
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: e.message})
  } 
})

const emailCustomerAboutFailedPayment = async(session) => {
  //todo
}

const createOrder = async(session) => {
  //todo
}

const fulfillOrder = async(session) => {
  try{
    const decodedData = jwt.decode(session.metadata.token, process.env.JWT_KEY)
    if(!decodedData) throw new Error('?')

    switch(decodedData.type) {
      case 'buyCargo': {
        const cargoInDb = await prisma.cargo.findFirst({
          where: {
            id: decodedData.body.id
          }
        })
        if(cargoInDb.individual) {
          await prisma.user_Cargo.create({
            data: {
              expire_stamp: epochTillExpirationDate(parseInt(cargoInDb.duration)),
              cargo_id: cargoInDb.id,
              flags: cargoInDb.flags,
              server_name: decodedData.serverName,
              steamid: decodedData.userData.userid
            }
          })
        }else {
          const allServers = await prisma.server.findMany()
          for(let server of allServers) {
            await prisma.user_Cargo.create({
              data: {
                expire_stamp: epochTillExpirationDate(parseInt(cargoInDb.duration)),
                cargo_id: cargoInDb.id,
                flags: cargoInDb.flags,
                server_name: server.name,
                steamid: decodedData.userData.userid
              }
            })
          }
        }
      }
    }
  }catch(e) {
    console.log('Error on fulfillOrder')
    console.log(e.message)
  }
}

function epochTillExpirationDate(days) {
  let currentEpoch = Math.floor(Date.now() / 1000)
  let daysInSec = Math.floor(days * 86400)
  return (currentEpoch + daysInSec)
}

export default router
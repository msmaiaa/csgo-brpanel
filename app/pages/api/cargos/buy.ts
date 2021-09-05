import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import jwt from 'jsonwebtoken'
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2020-08-27'
})

const path = "/api/cargos/buy";

router.post(path, requireAuth, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const cargoData = req.body.cargo
    const userData = req.user
    const dataToEncode: any = {
      type: 'buyCargo',
      userData: {
        userid:userData.steamid
      },
      body: {
        id: cargoData.id
      }
    }
    if(cargoData.individual) {
      dataToEncode.serverName = cargoData.serverName
    }
    const encodedData = await jwt.sign(dataToEncode, process.env.JWT_KEY)
    const session = await generateStripeSession(cargoData, encodedData)
    return res.status(200).json({url: session.url})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Não foi possível concluir a compra'}) 
  }
});

const generateStripeSession = async(cargoData, encodedData) => {
  try{
    //still need todo a proper success_url/cancel_url
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: cargoData.stripe_id,
          quantity: 1,
        },
      ],
      payment_method_types: [
        'boleto',
        'card',
      ],
      mode: 'payment',
      locale: 'pt-BR',
      success_url: `${process.env.DOMAIN}`,
      cancel_url: `${process.env.DOMAIN}` ,
      metadata: {
        token: encodedData
      }
    });
    return session
  }catch(e) {
    console.error('Error on generateStripeSession', e.message)
  }
}

export default router

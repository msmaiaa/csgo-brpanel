import router from "lib/router";
import { ApiRequest, ApiResponse, ISteamApiUser } from "types"
import requireAuth from "middlewares/auth/requireAuth";
import axios from 'axios'
import url from 'url'
import xml from 'xml-js'
import Sale from "models/Sale";
import { ICargo } from "types";

interface ISaleExtraData {
  type: string,
  userData: {
    userid: string
  }
  body: {
    cargo_id?: string    
    serverName?: string
  }
}
interface ICargoData extends ICargo{
  serverName?: string
}

const pagseguroUrl = `https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=${process.env.PAGSEGURO_EMAIL}&token=${process.env.PAGSEGURO_TOKEN}`

const path = "/api/cargos/buy";

router.post(path, requireAuth, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    const cargoData: ICargoData = req.body.cargo
    const userData: ISteamApiUser = req.user
    const extraData: ISaleExtraData = {
      type: 'buyCargo',
      userData: {
        userid:userData.steamid
      },
      body: {
        cargo_id: cargoData.id
      }
    }
    if(cargoData.individual) {
      extraData.body.serverName = cargoData.serverName
    }
    let returnUrl = ''
    if(req.body.gateway === 'pagseguro') {
      const pagseguroUrl = await generatePagseguroData(cargoData, extraData)
      returnUrl = pagseguroUrl
    }
    return res.status(200).json({url: returnUrl})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Não foi possível concluir a compra'}) 
  }
});

const generatePagseguroData = async(saleData, extraData: ISaleExtraData) => {
  try{
    let createSaleData: any = {
      gateway: 'Pagseguro',
      customer_steamid: extraData.userData.userid,
      payment_status: 'incomplete',
      amount: saleData.price,
      additional_data: {...extraData.body}
    }
    let pagseguroRequestData: any = {
      currency: 'BRL',
      shippingAddressRequired: 'false',
      redirectURL: process.env.APP_ENV === 'production' ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV,
      notificationURL: `${process.env.APP_ENV=== 'production' ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV}/api/webhooks/pagseguro`,
      itemQuantity1: '1',
      itemWeight1: '0',
      maxUses: '1',
      itemAmount1: `${saleData.price}.00` ,
      itemId1: '',
      itemDescription1: ''
    }

    if(extraData.type === 'buyCargo') {
      createSaleData.purchase_type = 'cargo'
      createSaleData.additional_info = `Cargo - ${saleData.name}`
    }
    const createdSale = await Sale.create({
      data: {...createSaleData}
    })
    if(extraData.type === 'buyCargo') {
      pagseguroRequestData.itemId1 = createdSale.id.toString(),
      pagseguroRequestData.itemDescription1 = `Cargo - ${saleData.name}`
    }

    const pagseguroRequest = new url.URLSearchParams({...pagseguroRequestData})
    const response = await axios.post(pagseguroUrl, pagseguroRequest.toString(), {headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }})
    const decoded:any = xml.xml2json(response.data, {compact: true, spaces: 2})
    const parsed = JSON.parse(decoded)
    return `https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${parsed.checkout.code._text}`
  }catch(e) {
    console.log('error on generatePagseguroData')
    console.error(e)
  }
}

export default router

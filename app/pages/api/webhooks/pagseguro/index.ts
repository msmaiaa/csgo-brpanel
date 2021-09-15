import { Prisma } from '.prisma/client';
import axios from 'axios'
import router from 'lib/router'
import Cargo from 'models/Cargo';
import Sale from 'models/Sale';
import Server from 'models/Server';
import NotificationSettings from 'models/settings/NotificationSettings';
import UserCargo from 'models/UserCargo';
import { addDaysToTimestamp, epochTillExpirationDate } from 'utils/date';
import { ISaleData, sendMailToCustomer } from 'utils/email';
import { sendDiscordNotification } from 'utils/notifications';
import xml from 'xml-js'

const path = '/api/webhooks/pagseguro'
let notificationUrl; 
if(process.env.NODE_ENV === 'development') {
  notificationUrl = `https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/`
}else if(process.env.NODE_ENV === 'production') {
  notificationUrl = `https://ws.pagseguro.uol.com.br/v3/transactions/notifications/`
}
const credentialsQuery = `email=${process.env.PAGSEGURO_EMAIL}&token=${process.env.PAGSEGURO_TOKEN}`

/*notificationCode: 
  O código que identifica a notificação. 
  Este código deve ser usado para consultar a notificação e obter os dados da transação associada. 
  Note que o código que identifica a notificação não é o mesmo que o código que identifica a transação.
notificationType: 
  O tipo da notificação enviada.
*/
interface INotificationBody {
  notificationCode: string,
  notificationType: string
}

interface IPagseguroWebhookXML {
    _declaration: {
      _attributes: { 
        version: string
        encoding: string
        standalone: string
      }
    },
    transaction: {
      date: { _text: string },
      code: { _text: string },
      type: { _text: string },
      status: { _text: string },
      lastEventDate: { _text: string },
      paymentMethod: { type: { _text: string }, code: { _text: string } },
      grossAmount: { _text: string },
      discountAmount: { _text: string },
      creditorFees: {
        installmentFeeAmount: { _text: string },
        intermediationRateAmount: { _text: string },
        intermediationFeeAmount: { _text: string }
      },
      netAmount: { _text: string },
      extraAmount: { _text: string },
      escrowEndDate: { _text: string },
      installmentCount: { _text: string },
      itemCount: { _text: string },
      items: {
        item: {
          id: { _text: string },
          description: { _text: string },
          quantity: { _text: string },
          amount: { _text: string }
        }
      },
      sender: {
        email: { _text: string },
        phone: { areaCode: { _text: string }, number: { _text: string } },
        documents: {
          document: { type: { _text: string }, value: { _text: string } }
        }
      },
      gatewaySystem: {
        type: { _text: string },
        rawCode: {
          _attributes: {
            'xsi:nil': string,
            'xmlns:xsi': string
          }
        },
        rawMessage: {
          _attributes: {
            'xsi:nil': string,
            'xmlns:xsi': string
          }
        },
        normalizedCode: {
          _attributes: {
            'xsi:nil': string,
            'xmlns:xsi': string
          }
        },
        normalizedMessage: {
          _attributes: {
            'xsi:nil': string,
            'xmlns:xsi': string
          }
        },
        authorizationCode: { _text: string },
        nsu: { _text: string },
        tid: { _text: string },
        establishmentCode: { _text: string },
        acquirerName: { _text: string }
      },
      primaryReceiver: { publicKey: { _text: 'PUBF216AD82EAC14608B6DC06EDFDB24188' } }
    }
}

router.post(path, async(req: any, res: any) => {
  try{
    const response:INotificationBody = req.body 
    const notificationResponse = await axios.get(notificationUrl + response.notificationCode + `?${credentialsQuery}`)
    const responseJson = xml.xml2json(notificationResponse.data, {compact: true, spaces: 2})
    const parsedResponse: IPagseguroWebhookXML = JSON.parse(responseJson)
    switch(parsedResponse.transaction.status._text) {
      case '1': {
        //waiting for payment
        //can be skipped if the financial institution is too quickly
      }
      case '2': {
        //in analysis
      }
      case '3': {
        //paid
        const updatedSale = await Sale.update({
          where: {
            id: parseInt(parsedResponse.transaction.items.item.id._text)
          },
          data: {
            payment_status: 'complete',
            customer_email: parsedResponse.transaction.sender.email._text,
            gateway_order_id: parsedResponse.transaction.code._text
          }
        })
        let additionalData = updatedSale.additional_data as Prisma.JsonObject
        if(updatedSale.purchase_type === 'cargo') {
          await handleAddCargo(updatedSale as ISaleData, additionalData)
        }
      }
      case '4': {
        //money available, can withdraw
      }
      case '7': {
        //canceled
      }
      default: 
       console.error('Unknown transaction status:', parsedResponse.transaction.status._text)
    }
    return res.status(200)
  }catch(e) {
    console.error('error on pagseguro webhook', e)
  }
})

const handleAddCargo = async(sale: ISaleData, additionalData) => {
  try{
    const cargoInDb = await Cargo.findOne({
      where: {
        id: additionalData.cargo_id
      }})
    if(cargoInDb.individual) {
      const hasCargo = await UserCargo.findOne({
        where: {
          server_name: additionalData.serverName,
          steamid: sale.customer_steamid
        }
      })
      if(hasCargo) {
        const newTimestamp = addDaysToTimestamp(cargoInDb.duration, hasCargo.expire_stamp)
        await UserCargo.update({
          where: {
            id: hasCargo.id
          },
          data: {
            cargo_id: cargoInDb.id,
            flags: cargoInDb.flags,
            expire_stamp: newTimestamp
          }
        })
      }else {
        await UserCargo.create({
          data: {
            expire_stamp: epochTillExpirationDate(parseInt(cargoInDb.duration)),
            cargo_id: cargoInDb.id,
            flags: cargoInDb.flags,
            server_name: additionalData.serverName,
            steamid: sale.customer_steamid
          }
        })
      }
    }else {
      const allServers = await Server.findAll()
      for(let server of allServers) {
        const hasCargo = await UserCargo.findOne({
          where: {
            server_name: server.name,
            steamid: sale.customer_steamid
          }
        })
        if(hasCargo) {
          const newTimestamp = addDaysToTimestamp(cargoInDb.duration, hasCargo.expire_stamp)
          await UserCargo.update({
            where: {
              id: hasCargo.id
            },
            data: {
              cargo_id: cargoInDb.id,
              flags: cargoInDb.flags,
              expire_stamp: newTimestamp
            }
          })
        }else{
          await UserCargo.create({
            data: {
              expire_stamp: epochTillExpirationDate(parseInt(cargoInDb.duration)),
              cargo_id: cargoInDb.id,
              flags: cargoInDb.flags,
              server_name: server.name,
              steamid: sale.customer_steamid
            }
          })
        }
      }
    }
    const notificationData: any = {
      action: "buy",
      what: "cargo",
      data: {
        amount: cargoInDb.price,
        customer_steamid: sale.customer_steamid,
        payment_status: 'completed',
        cargo_name: cargoInDb.name,
        server: 'Todos'
      }
    }
    if(cargoInDb.individual) {
      const serverData = await Server.findOne({
        where: {
          name: additionalData.serverName
        }
      })
      notificationData.data.server = serverData.full_name
    }
    const nSettings = await NotificationSettings.findOne()
    if(nSettings.send_discord_notifications && nSettings.send_disc_on_sale) {
      notificationData.settings = nSettings
      sendDiscordNotification(notificationData)
    }
    if(nSettings.send_email_sale) {
      sendMailToCustomer(sale, 'saleFulfilled')
    }
  }catch(e) {
    console.error(e)
  }
}

export default router
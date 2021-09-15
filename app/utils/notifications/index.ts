import { NotificationSettings } from ".prisma/client";
import _NotificationSettings from "models/settings/NotificationSettings";
import DiscordNotification from "./discord";


export interface ISendNotification {
  action: string
  what?: string
  data: IBoughtCargo | IPanelUpdate
  settings?: NotificationSettings
}

export interface IPanelUpdate {
  activity: string
  additionalInfo: string
  createdBy: string
}

export interface IBoughtCargo {
  amount: string
  customer_steamid: string
  payment_status: string
  cargo_name: string
  server: string
}

export async function sendDiscordNotification({data, what, action}: ISendNotification) {
  try{
    const settings = await _NotificationSettings.findOne()
    if(!settings.send_discord_notifications) return

    const notification = new DiscordNotification(settings)
    if(action === 'buy') {
      if(!settings.send_disc_on_sale) return
      await notification.onSale({
        data: data,
        what: what
      } as any)
    }else if (action === 'modify') {
      if(!settings.send_disc_on_modification) return
      const newData: IPanelUpdate = data as any 
      await notification.onModification(newData)
    }
  }catch(e) {
    console.log('error on sendDiscordNotification')
    console.error(e)
  }
}
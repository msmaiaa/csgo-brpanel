import Log from 'models/Log'
import NotificationSettings from 'models/settings/NotificationSettings'
import { IPanelUpdate, sendDiscordNotification } from 'utils/notifications'

export async function logInDb (activity, additionalInfo, createdBy) {
  try{
    await Log.create({
      data: {
        activity,
        additional_info: additionalInfo,
        created_by: createdBy
      }
    })
    const data: IPanelUpdate = {
      activity,
      additionalInfo,
      createdBy
    }
    const nSettings = await NotificationSettings.findOne()
    if(nSettings.send_discord_notifications && nSettings.send_disc_on_modification) {
      sendDiscordNotification({ data, action: "modify", settings: nSettings})
    }
  }catch(e) {
    console.error('Error while trying to log data')
    console.error(e)
  }
}


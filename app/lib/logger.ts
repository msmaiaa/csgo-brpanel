import Log from 'models/Log'
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
    sendDiscordNotification({ data, action: "modify"})
  }catch(e) {
    console.error('Error while trying to log data')
    console.error(e)
  }
}


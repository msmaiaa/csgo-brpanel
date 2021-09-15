import router from 'lib/router'
import requireSuperAdmin from 'middlewares/auth/requireSuperAdmin'
import NotificationSettings from 'models/settings/NotificationSettings'
import DiscordNotification from 'utils/notifications/discord'

const path = '/api/discord/test'
router.post(path, requireSuperAdmin, async(req: any, res: any) => {
  try{
    const settings = await NotificationSettings.findOne()
    const notificaton = new DiscordNotification(settings)
    await notificaton.testMessage()
    return res.status(200).json({message: 'ok'})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Não foi possível enviar o webhook'})
  }
})

export default router
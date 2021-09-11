import router from '../../../lib/router'
import prisma from '../../../lib/prisma'
import requireSuperAdmin from 'middlewares/auth/requireSuperAdmin';

const path = '/api/settings'
router.get(path, requireSuperAdmin, async(req: any, res: any) => {
  try{
    let foundSettings;
    switch(req.query.scope) {
      case 'notifications': {
        // if doesnt have a column with the id 1, create one
        // the "update" key is just there to stop prisma from crying
        foundSettings = await prisma.notificationSettings.upsert({
          where: {
            id: 1
          },
          create: {
            send_email_sale: false, 
            send_disc_on_sale: false, 
            send_disc_on_modification: false,  
            send_discord_notifications: false,  
            community_name: "",
            community_website: "", 
            webhook_url: "", 
            logo_url: ""
          },
          update: {
          }
        })
      }
    }
    return res.status(200).json({body: foundSettings})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Não foi possível encontrar as informações das configurações.'})
  }
})

export default router
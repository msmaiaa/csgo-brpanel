import router from '../../../lib/router'
import prisma from '../../../lib/prisma'
import { logInDb } from '../../../lib/logger';

const path = '/api/settings/update'
router.post(path, async(req: any, res: any) => {
  try{
    let updatedSettings;
    switch(req.body.scope) {
      case 'notifications': {
        updatedSettings = await prisma.notificationSettings.update({
          where: {
            id: 1
          },
          data: {
            ...req.body.data
          }
        })
      }
    }
    logInDb('Configurações atualizadas', 'Notificações', req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Configurações atualizadas com sucesso.'})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Não foi possível atualizar as configurações.'})
  }
})

export default router
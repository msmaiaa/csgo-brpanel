import router from 'lib/router'
import { ApiRequest, ApiResponse } from "types"
import requireSuperAdmin from 'middlewares/auth/requireSuperAdmin';
import { logInDb } from 'lib/logger';
import NotificationSettings from 'models/settings/NotificationSettings';

const path = '/api/settings/update'
router.post(path, requireSuperAdmin, async(req: ApiRequest, res: ApiResponse) => {
  try{
    let updatedSettings;
    switch(req.body.scope) {
      case 'notifications': {
        updatedSettings = await NotificationSettings.update({
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
import router from 'lib/router'
import requireAdmin from 'middlewares/auth/requireAdmin'
import { logInDb } from 'lib/logger'
import UserCargo from 'models/UserCargo'

const path = ('/api/cargos/removeFromUser')

router.post(path, requireAdmin, async(req: any, res: any) => {
  try{
    let deleted;
    if(req.body.all) {
      deleted = await UserCargo.deleteMany({
        where: {
          steamid: req.body.user.steamid
        }
      })
      logInDb('Cargo(s) removidos do usuário', 'Todos os cargos - ' + req.body.user.name, req.user.personaname + ' - ' + req.user.steamid)
    }
    //TODO: delete single cargo from user
    
    return res.status(200).json({message: 'Cargo(s) removido(s) com sucesso'})
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível remover o(s) cargo(s) do usuário.'})
  }
})

export default router
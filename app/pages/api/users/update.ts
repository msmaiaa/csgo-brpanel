import User from 'models/User'
import { logInDb } from 'lib/logger'
import router from 'lib/router'
import requireAdmin from 'middlewares/auth/requireAdmin'

const path = '/api/users/update'

router.post(path, requireAdmin, async(req: any, res: any) => {
  try{
    const updatedUser = await User.update({
      where: {
        id: req.body.id
      },
      data: {
        ...req.body.data
      }
    })
    logInDb('Usuário atualizado', updatedUser.name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Usuário atualizado com sucesso'})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Erro ao atualizar usuário.'})
  }
})

export default router
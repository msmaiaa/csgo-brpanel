import { logInDb } from '../../../lib/logger'
import prisma from '../../../lib/prisma'
import router from '../../../lib/router'
import requireAdmin from '../../../middlewares/auth/requireAdmin'

const path = '/api/users/update'

router.post(path, requireAdmin, async(req: any, res: any) => {
  try{
    const updatedUser = await prisma.user.update({
      where: {
        id: req.body.id
      },
      data: {
        ...req.body.data
      }
    })
    logInDb('Usuário atualizado', updatedUser.name, req.user.personaname)
    return res.status(200).json({message: 'Usuário atualizado com sucesso'})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Erro ao atualizar usuário.'})
  }
})

export default router
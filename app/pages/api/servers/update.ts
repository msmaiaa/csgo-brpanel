import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'
import { logInDb } from "../../../lib/logger";

const path = "/api/servers/update";

router.post(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const updatedServer = await prisma.server.update({
      where: {
        id: req.body.id
      },
      data: {
        ...req.body
      }
    })
    logInDb('Novo cargo criado', updatedServer.full_name, req.user.personaname + ' - ' + req.user.steamid)
    if(updatedServer) return res.status(200).json({message: 'Servidor atualizado com sucesso', body: updatedServer}) 
    return res.status(500).json({message: 'Não foi possível atualizar o servidor'}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um servidor com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível atualizar o servidor'}) 
  }
});

export default router

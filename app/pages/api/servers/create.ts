import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'

const path = "/api/servers/create";

router.post(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: '?'})
    const createdServer = await prisma.server.create({
      data: req.body
    })
    if(createdServer) return res.status(200).json({message: 'Servidor criado com sucesso', body: createdServer}) 
    return res.status(500).json({message: 'Não foi possível criar o servidor'}) 
  }catch(e) {
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um servidor com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível criar o servidor'}) 
  }
});

export default router

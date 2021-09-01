import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'

const path = "/api/cargos/update";

router.post(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const updatedServer = await prisma.cargo.update({
      where: {
        id: req.body.cargo.id
      },
      data: {
        ...req.body.cargo
      }
    })
    if(updatedServer) return res.status(200).json({message: 'Cargo atualizado com sucesso', body: updatedServer}) 
    return res.status(500).json({message: 'Não foi possível atualizar o cargo'}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um cargo com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível atualizar o cargo'}) 
  }
});

export default router

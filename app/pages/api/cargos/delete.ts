import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'

const path = "/api/cargos/delete";

router.post(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const deletedCargo = await prisma.cargo.delete({
      where: {
        id: req.body.cargo.id
      }
    })
    if(deletedCargo) return res.status(200).json({message: 'Cargo deletado com sucesso', body: deletedCargo}) 
    return res.status(500).json({message: 'Não foi possível deletar o cargo'}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2014') return res.status(500).json({message: 'Você não pode deletar um cargo com usuários atribuidos à ele.'}) 
    return res.status(500).json({message: 'Não foi possível deletar o cargo'}) 
  }
});

export default router

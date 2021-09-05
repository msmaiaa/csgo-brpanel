import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'
import { logInDb } from "../../../lib/logger";

const path = "/api/cargos/update";

router.post(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const oldCargo = await prisma.cargo.findFirst({
      where: {
        id: req.body.cargo.id
      }
    })
    const updatedCargo = await prisma.cargo.update({
      where: {
        id: req.body.cargo.id
      },
      data: {
        ...req.body.cargo
      }
    })
    

    /*
    * Updating existing Users that have the cargo with the updated data
    */
    if(oldCargo.flags !== updatedCargo.flags) {
      await prisma.user_Cargo.updateMany({
        where: {
          cargo_id: updatedCargo.id
        },
        data: {
          flags: updatedCargo.flags
        }
      })
    }
    logInDb('Cargo atualizado', updatedCargo.name, req.user.personaname + ' - ' + req.user.steamid)
    if(updatedCargo) return res.status(200).json({message: 'Cargo atualizado com sucesso', body: updatedCargo}) 
    return res.status(500).json({message: 'Não foi possível atualizar o cargo'}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um cargo com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível atualizar o cargo'}) 
  }
});

export default router

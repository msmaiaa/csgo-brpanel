import router from "../../../lib/router";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'
import { logInDb } from "../../../lib/logger";

const path = "/api/cargos/update";

router.post(path, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const oldCargo = await prisma.cargo.findFirst({
      where: {
        id: req.body.cargo.id
      }
    })
    const cargo_server = await prisma.cargo_Server.findMany({
      where: {
        cargo_id: oldCargo.id
      }
    })
    if(oldCargo.individual && req.body.cargo.individual) {
      if(cargo_server.length != req.body.cargo.servers) {
        await prisma.cargo_Server.deleteMany({})
        for(let server of req.body.cargo.servers) {
          await prisma.cargo_Server.create({
            data: {
              cargo_id: oldCargo.id,
              server_id: server.id
            }
          })
        }
      }
    }
    if(oldCargo.individual && !req.body.cargo.individual) {
      await prisma.cargo_Server.deleteMany({
        where: {
          cargo_id: oldCargo.id
        }
      })
    }else if(!oldCargo.individual && req.body.cargo.individual) {
      for(let server of req.body.cargo.servers) {
        await prisma.cargo_Server.create({
          data: {
            cargo_id: oldCargo.id,
            server_id: server.id
          }
        })
      }
    }
    delete req.body.cargo.servers
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

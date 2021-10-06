import router from "lib/router";
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import { logInDb } from "lib/logger";
import Cargo from "models/Cargo";
import CargoServer from "models/CargoServer";
import UserCargo from "models/UserCargo";

const path = "/api/cargos/update";

router.post(path, requireSuperAdmin, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const oldCargo = await Cargo.findOne({
      where: {
        id: req.body.cargo.id
      }
    })
    const cargo_server = await CargoServer.findMany({
      where: {
        cargo_id: oldCargo.id
      }
    })

    if(oldCargo.individual && req.body.cargo.individual) {
      if(cargo_server.length != req.body.cargo.servers) {
        await CargoServer.deleteAll()
        for(let server of req.body.cargo.servers) {
          await CargoServer.create({
            data: {
              cargo_id: oldCargo.id,
              server_id: server.id
            }
          })
        }
      }
    }
    if(oldCargo.individual && !req.body.cargo.individual) {
      await CargoServer.deleteMany({
        where: {
          cargo_id: oldCargo.id
        }
      })
    }else if(!oldCargo.individual && req.body.cargo.individual) {
      for(let server of req.body.cargo.servers) {
        await CargoServer.create({
          data: {
            cargo_id: oldCargo.id,
            server_id: server.id
          }
        })
      }
    }
    delete req.body.cargo.servers
    const updatedCargo = await Cargo.update({
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
      await UserCargo.updateMany({
        where: {
          cargo_id: updatedCargo.id
        },
        data: {
          flags: updatedCargo.flags
        }
      })
    }
    logInDb('Cargo atualizado', updatedCargo.name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Cargo atualizado com sucesso', body: updatedCargo}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um cargo com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível atualizar o cargo'}) 
  }
});

export default router

import router from "lib/router";
import { ApiRequest, ApiResponse } from "types"
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import { logInDb } from "lib/logger";
import Cargo from "models/Cargo";
import CargoServer from "models/CargoServer";

const path = "/api/cargos/create";

router.post(path, requireSuperAdmin, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    const createdCargo = await Cargo.createOne({ data:req.body.cargo })
    const parsedData = req.body.servers.map((server) => {
      return {
        cargo_id: createdCargo.id,
        server_id: server.id
      }
    })
    if(createdCargo.individual) {
      await CargoServer.createMany({
        data: parsedData
      })
    }
    logInDb('Novo cargo criado', createdCargo.name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Cargo criado com sucesso', body: createdCargo}) 
  }catch(e) {
    console.error(e)
    let errorResponse = 'Não foi possível criar o cargo.'
    if(e.code === 'P2002'){
      if(e.meta.target === "stripe_id_unique") {
        errorResponse = 'Já existe um cargo com esse id.'
      }else if(e.meta.target === "name_unique") {
        errorResponse = 'Já existe um cargo com esse nome.'
      }
    }
    return res.status(500).json({message: errorResponse}) 
  }
});

export default router

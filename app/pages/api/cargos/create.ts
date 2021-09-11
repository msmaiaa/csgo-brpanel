import router from "../../../lib/router";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'
import { logInDb } from "../../../lib/logger";

const path = "/api/cargos/create";

router.post(path, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const createdCargo = await prisma.cargo.create(
      {data:req.body.cargo }
    )
    const parsedData = req.body.servers.map((server) => {
      return {
        cargo_id: createdCargo.id,
        server_id: server.id
      }
    })
    if(createdCargo.individual) {
      await prisma.cargo_Server.createMany({
        data: parsedData
      })
    }
    logInDb('Novo cargo criado', createdCargo.name, req.user.personaname + ' - ' + req.user.steamid)
    if(createdCargo) return res.status(200).json({message: 'Cargo criado com sucesso', body: createdCargo}) 
    return res.status(500).json({message: 'Não foi possível criar o cargo'}) 
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

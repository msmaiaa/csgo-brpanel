import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'

const path = "/api/cargos/create";

router.post(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
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
    if(createdCargo) return res.status(200).json({message: 'Cargo criado com sucesso', body: createdCargo}) 
    return res.status(500).json({message: 'Não foi possível criar o cargo'}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um cargo com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível criar o cargo'}) 
  }
});

export default router

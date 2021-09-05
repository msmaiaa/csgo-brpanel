import router from "../../../lib/router";
import prisma from '../../../lib/prisma'

const path = "/api/cargos/";

router.get(path, async(req: any, res: any) => { 
  try{
    let foundCargos;
    if(req.query.all) {
      foundCargos = await prisma.cargo.findMany({
        where: {
          individual: false
        }
      })
    }else {
      foundCargos = await prisma.cargo.findMany()
    }
    const filteredCargos = foundCargos.map((cargo) => {
      let filtered = cargo
      delete filtered.updated_at
      delete filtered.created_at
      return filtered
    })
    return res.status(200).json({body: filteredCargos}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar os cargos'}) 
  }
});

export default router

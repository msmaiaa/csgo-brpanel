import router from "lib/router";
import Cargo from "models/Cargo";

const path = "/api/cargos/";

router.get(path, async(req: any, res: any) => { 
  try{
    let foundCargos;
    if(req.query.all) {
      foundCargos = await Cargo.findMany({
        where: {
          individual: false
        }
      })
    }else {
      foundCargos = await Cargo.findMany({
        include: {
          cargo_server: {
            include: {
              server: true
            }
          }
        }
      })
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

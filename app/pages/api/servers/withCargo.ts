import router from "lib/router";
import Server from "models/Server";

const path = "/api/servers/withCargo";

/*
* Gets all the servers and each server relationed cargo
*/
router.get(path, async(req: any, res: any) => { 
  try{
    const foundCargos = await Server.findManyWithCargoServer({
      select: {
        full_name: true,
        id: true,
        ip: true,
        name: true,
        port: true,
        cargo_server: {
          include: {
            cargo: true
          }
        }
      },
    })
    return res.status(200).json({body: foundCargos})  
  }catch(e) {
    return res.status(500).json({message: 'Erro'}) 
  }
});

export default router

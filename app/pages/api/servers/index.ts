import router from "lib/router";
import Server from "models/Server";
import { ApiRequest, ApiResponse } from "types"

const path = "/api/servers/";

router.get(path, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    const foundServers = await Server.findAll()
    const filteredServers = foundServers.map((server) => {
      let filtered = server
      if(!req.query.rcon) delete filtered.rcon_pass
      delete filtered.updated_at
      delete filtered.created_at
      return filtered
    })
    return res.status(200).json({body: filteredServers}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar os servidores'}) 
  }
});

export default router

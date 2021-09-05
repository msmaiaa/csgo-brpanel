import router from "../../../lib/router";
import prisma from '../../../lib/prisma'

const path = "/api/servers/";

router.get(path, async(req: any, res: any) => { 
  try{
    const foundServers = await prisma.server.findMany()
    const filteredServers = foundServers.map((server) => {
      let filtered = server
      delete filtered.rcon_pass
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

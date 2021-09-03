import router from "../../../lib/router";
import requireAuth from "../../../middlewares/auth/requireAuth";
import requireSuperAdmin from "../../../middlewares/auth/requireSuperAdmin";
import prisma from '../../../lib/prisma'

const path = "/api/servers/rcon";

//todo: delete this shit
router.get(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    const foundServers = await prisma.server.findMany()
    const filteredServers = foundServers.map((server) => {
      let filtered = server
      delete filtered.created_at
      delete filtered.updated_at
      return filtered
    })
    return res.status(200).json({body: filteredServers}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar os servidores'}) 
  }
});

export default router

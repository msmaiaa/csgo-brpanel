import router from "../../../lib/router";
import prisma from '../../../lib/prisma'

const path = "/api/servers/withCargo";

router.get(path, async(req: any, res: any) => { 
  try{
    const foundCargos = await prisma.server.findMany({
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

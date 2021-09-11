import router from "../../../lib/router";
import prisma from '../../../lib/prisma'
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";

const path = "/api/logs/";

router.get(path, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    const page = req.query.page
    const skipCount = page === 1 ? 0 : (10*page) - 10
    const foundLogs = await prisma.$transaction([
      prisma.log.count(),
      prisma.log.findMany({
        take: 10,
        skip: skipCount,
        orderBy: {
          created_at: 'desc'
        }
      })
    ])
    return res.status(200).json({body: foundLogs}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar os cargos'}) 
  }
});

export default router

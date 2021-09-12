import router from "lib/router";
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import Log from "models/Log";

const path = "/api/logs/";

router.get(path, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    const page = req.query.page
    const skipCount = page === 1 ? 0 : (10*page) - 10
    const foundLogs = await Log.findAllWithPagination({
      take: 10,
      skipCount,
      orderBy: 'desc'
    })
    return res.status(200).json({body: foundLogs}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar os cargos'}) 
  }
});

export default router

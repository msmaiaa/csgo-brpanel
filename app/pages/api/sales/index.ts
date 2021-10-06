import router from 'lib/router'
import { ApiRequest, ApiResponse } from "types"
import requireSuperAdmin from 'middlewares/auth/requireSuperAdmin'
import Sale from 'models/Sale'

const path = "/api/sales"

router.get(path, requireSuperAdmin, async(req: ApiRequest, res: ApiResponse) => {
  try{
    const page: any = req.query.page
    const skipCount = page === 1 ? 0 : (10*page) - 10
    const foundSales = await Sale.findAllWithPagination({
      take: 10,
      skipCount,
      orderBy: 'desc'
    })
    return res.status(200).json({body: foundSales}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar o histórico de vendas.'})
  }
})

export default router
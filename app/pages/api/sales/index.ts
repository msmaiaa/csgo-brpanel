import router from '../../../lib/router'
import prisma from '../../../lib/prisma'
import requireAuth from '../../../middlewares/auth/requireAuth'
import requireSuperAdmin from '../../../middlewares/auth/requireSuperAdmin'

const path = "/api/sales"

router.get(path, requireAuth, requireSuperAdmin, async(req: any, res: any) => {
  try{
    const page = req.query.page
    const skipCount = page === 1 ? 0 : (10*page) - 10
    const foundSales = await prisma.$transaction([
      prisma.sale.count(),
      prisma.sale.findMany({
        take: 10,
        skip: skipCount,
        orderBy: {
          created_at: 'desc'
        }
      })
    ])
    return res.status(200).json({body: foundSales}) 
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar o histórico de vendas.'})
  }
})

export default router
import router from '../../../lib/router'
import requireAuth from '../../../middlewares/auth/requireAuth'
import requireAdmin from '../../../middlewares/auth/requireAdmin'
import prisma from '../../../lib/prisma'

const path = '/api/users/'

router.get(path, requireAuth, requireAdmin, async(req: any, res: any) => {
  try{
    const page = req.query.page
    const skipCount = page === 1 ? 0 : (10*page) - 10
    const foundUsers = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        take: 10,
        skip: skipCount,
        orderBy: {
          created_at: 'desc'
        },
        include: {
          user_cargo: {
            include: {
              server: true,
              cargo: true
            }
          }
        }
      })
    ])
    let formattedData: any = [...foundUsers]
    for(let user of formattedData[1]){
      if(user.user_cargo.length > 0) {
        for(let uc of user.user_cargo) {
          delete uc.expire_stamp
        }
      }
    }
    return res.status(200).json({body: foundUsers})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: e.message})
  }
})


export default router
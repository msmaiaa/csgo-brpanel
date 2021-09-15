import router from 'lib/router'
import requireAuth from 'middlewares/auth/requireAuth'
import Sale from 'models/Sale'
import UserCargo from 'models/UserCargo'

const path = 'api/users/status'

router.get(path, requireAuth, async(req: any, res: any) => {
  try{
    const returnData: any = {
      cargos: [],
      sales: [],
    }
    returnData.cargos = await UserCargo.findMany({
      where: {
        steamid: req.user.steamid
      },
      select: {
        cargo: {
          select: {
            name: true
          }
        },
        server: {
          select: {
            full_name: true
          }
        }
      }
    })
    returnData.sales = await Sale.findAllByUser({ steamid: req.user.steamid })
    return res.status(200).json({body:{...returnData}})
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: 'Error'})
  }
})

export default router
import router from 'lib/router'
import { ApiRequest, ApiResponse } from "types"
import requireAdmin from 'middlewares/auth/requireAdmin'
import User from 'models/User'

const path = '/api/users/'

router.get(path, requireAdmin, async(req: ApiRequest, res: ApiResponse) => {
  try{
    const page: any = req.query.page
    const skipCount = page === 1 ? 0 : (10*page) - 10
    const foundUsers = await User.findAllWithUserCargo({
      orderBy: 'desc',
      skipCount,
      take: 10
    })
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
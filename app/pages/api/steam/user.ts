import router from '../../../lib/router'
import requireAuth from '../../../middlewares/auth/requireAdmin'
import requireAdmin from '../../../middlewares/auth/requireAdmin'
import { fetchProfile } from '../../../utils/steam'

const path = '/api/steam/user'
router.post(path, requireAuth, requireAdmin, async(req: any, res: any) => {
  try{
    const foundUserInfo = await fetchProfile(req.body.data)
    if(foundUserInfo.data.response.players.length < 1) return res.status(500).json({message: 'Não foi possivel encontrar um jogador com os dados informados.'})
    return res.status(200).json({message: 'Usuário encontrado', body: foundUserInfo.data.response.players})
  }catch(e) {
    return res.status(500).json({message: e.message})
  }
})

export default router
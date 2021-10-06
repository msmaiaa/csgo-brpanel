import router from "lib/router";
import { ApiRequest, ApiResponse } from "types"
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import { logInDb } from "lib/logger";
import Cargo from "models/Cargo";

const path = "/api/cargos/delete";

router.post(path, requireSuperAdmin, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    if(!req.body) return res.status(422).json({message: 'Parametros faltando'})
    const deletedCargo = await Cargo.deleteWhere({
      where: {
        id: req.body.cargo.id
      }
    })
    logInDb('Cargo deletado', req.body.cargo.name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Cargo deletado com sucesso', body: deletedCargo}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2014') return res.status(500).json({message: 'Você não pode deletar um cargo com usuários atribuidos à ele.'}) 
    return res.status(500).json({message: 'Não foi possível deletar o cargo'}) 
  }
});

export default router

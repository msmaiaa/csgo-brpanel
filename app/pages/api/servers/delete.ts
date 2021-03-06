import router from "lib/router";
import { ApiRequest, ApiResponse } from "types"
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import { logInDb } from "lib/logger";
import Server from "models/Server";

const path = "/api/servers/delete";

router.delete(path, requireSuperAdmin, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    if(!req.body) return res.status(422).json({message: '?'})
    const deletedServer = await Server.delete({
      where: {
        id: req.body.id
      }
    })
    logInDb('Servidor deletado', deletedServer.full_name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Servidor deletado com sucesso', body: deletedServer}) 
  }catch(e) {
    console.error(e.message)
    let errorResponse = 'Não foi possível deletar o servidor'
    if(e.code === 'P2014') {
      if(e.meta.relation_name === 'ServerToUser_Cargo') {
        errorResponse = 'Existe um ou mais usuários com cargo neste servidor. Retire os cargos para deletar o servidor.'
      }
    }
    return res.status(500).json({message: errorResponse}) 
  }
});

export default router

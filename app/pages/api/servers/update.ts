import router from "lib/router";
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import { logInDb } from "lib/logger";
import Server from "models/Server";

const path = "/api/servers/update";

router.post(path, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    const updatedServer = await Server.update({
      where: {
        id: req.body.id
      },
      data: {
        ...req.body
      }
    })
    logInDb('Servidor atualizado', updatedServer.full_name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Servidor atualizado com sucesso', body: updatedServer}) 
  }catch(e) {
    console.error(e)
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um servidor com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível atualizar o servidor'}) 
  }
});

export default router

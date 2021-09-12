import router from "lib/router";
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import { logInDb } from "lib/logger";
import Server from "models/Server";

const path = "/api/servers/create";

router.post(path, requireSuperAdmin, async(req: any, res: any) => { 
  try{
    const createdServer = await Server.create({
      data: req.body
    })
    logInDb('Novo servidor criado', createdServer.full_name, req.user.personaname + ' - ' + req.user.steamid)
    return res.status(200).json({message: 'Servidor criado com sucesso', body: createdServer}) 
  }catch(e) {
    if(e.code === 'P2002') return res.status(500).json({message: 'Já existe um servidor com esse nome.'}) 
    return res.status(500).json({message: 'Não foi possível criar o servidor'}) 
  }
});

export default router

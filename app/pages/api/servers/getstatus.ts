import router from "lib/router";
import { ApiRequest, ApiResponse } from "types"

import Gamedig from 'gamedig'
const path = "/api/servers/getstatus";

router.post(path, async(req: ApiRequest, res: ApiResponse) => { 
  try{
    Gamedig.query({
      type: 'csgo',
      host: req.body.server.ip,
      port: req.body.server.port
    }).then((state) => {
      return res.status(200).json({body: state}) 
    }).catch((error) => {
      return res.status(500).json({body: error.message}) 
    });
  }catch(e) {
    return res.status(500).json({message: 'Não foi possível encontrar os servidores'}) 
  }
});

export default router

import router from "lib/router";
import { ApiRequest, ApiResponse } from "types";

import Gamedig from "gamedig";
const path = "/api/servers/getstatus";

router.post(path, async (req: ApiRequest, res: ApiResponse) => {
  try {
    const { ip: host, port } = req.body.server;
    const response = await Gamedig.query({
      type: "csgo",
      host,
      port,
    });
    return res.status(200).json({ body: response });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Não foi possível encontrar os servidores" });
  }
});

export default router;

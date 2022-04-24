import router from "lib/router";
import { ApiRequest, ApiResponse } from "types";
import { logInDb } from "lib/logger";
import User from "models/User";

const path = "/api/users/create";
router.post(path, async (req: ApiRequest, res: ApiResponse) => {
  try {
    const { username, steamid, user_type } = req.body.data;
    await User.create({
      data: {
        name: username,
        steamid,
        user_type,
      },
    });
    logInDb(
      "Novo usuário registrado",
      username + " - " + steamid,
      req.user.personaname + " - " + req.user.steamid
    );
    return res
      .status(200)
      .json({ message: `Usuário ${username} adicionado com sucesso.` });
  } catch (e) {
    console.error(e);
    let responseMessage = "Não foi possível criar o usuário.";
    if (e.code === "P2002") {
      if (e.meta.target === "steamid_unique")
        responseMessage = "Já existe um usuário cadastrado com este SteamID";
    }
    return res.status(500).json({ message: responseMessage });
  }
});

export default router;

import router from "lib/router";
import { ApiRequest, ApiResponse, ICargo } from "types";
import requireAuth from "middlewares/auth/requireAuth";
import SaleModel from "models/Sale";
import UserCargoModel from "models/UserCargo";
import { ISaleData } from "utils/email";
import { Sale, User_Cargo } from "@prisma/client";

const path = "api/users/status";

interface Response {
  cargos: User_Cargo[];
  sales: Sale[];
}
router.get(path, requireAuth, async (req: ApiRequest, res: ApiResponse) => {
  try {
    const response: Response = {
      cargos: [],
      sales: [],
    };

    response.cargos = await UserCargoModel.findMany({
      where: {
        steamid: req.user.steamid,
      },
      select: {
        cargo: {
          select: {
            name: true,
          },
        },
        server: {
          select: {
            full_name: true,
          },
        },
      },
    });
    response.sales = await SaleModel.findAllByUser({
      steamid: req.user.steamid,
    });
    return res.status(200).json({ body: { ...response } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error" });
  }
});

export default router;

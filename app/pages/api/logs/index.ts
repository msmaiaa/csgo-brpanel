import router from "lib/router";
import { ApiRequest, ApiResponse } from "types";
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import Log from "models/Log";

const path = "/api/logs/";

router.get(
  path,
  requireSuperAdmin,
  async (req: ApiRequest, res: ApiResponse) => {
    try {
      const page: number = Number(req.query.page) || 1;
      const skipCount = page === 1 ? 0 : 10 * page - 10;
      const foundLogs = await Log.findAllWithPagination({
        take: 10,
        skipCount,
        orderBy: "desc",
      });
      return res.status(200).json({ body: foundLogs });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Não foi possível encontrar os cargos" });
    }
  }
);

export default router;

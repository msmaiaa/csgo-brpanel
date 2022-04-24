import router from "lib/router";
import { ApiRequest, ApiResponse } from "types";
import requireSuperAdmin from "middlewares/auth/requireSuperAdmin";
import NotificationSettings from "models/settings/NotificationSettings";

const path = "/api/settings";
router.get(
  path,
  requireSuperAdmin,
  async (req: ApiRequest, res: ApiResponse) => {
    try {
      let foundSettings;
      switch (req.query.scope) {
        case "notifications": {
          foundSettings = await NotificationSettings.findOrCreate({
            where: {
              id: 1,
            },
            create: {
              send_email_sale: false,
              send_disc_on_sale: false,
              send_disc_on_modification: false,
              send_discord_notifications: false,
              community_name: "",
              community_website: "",
              webhook_url: "",
              logo_url: "",
            },
          });
        }
      }
      return res.status(200).json({ body: foundSettings });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Não foi possível encontrar as informações das configurações.",
      });
    }
  }
);

export default router;

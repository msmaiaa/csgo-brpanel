import { NotificationSettings } from ".prisma/client";
import { Webhook } from "simple-discord-webhooks";
import { IBoughtCargo, IPanelUpdate } from ".";

interface IOnSale {
  what: "cargo" | string;
  data: IBoughtCargo;
}

export default class DiscordNotification {
  settings: NotificationSettings;
  webhook;
  message = {
    title: "",
    author: {},
    url: "",
    fields: [],
    thumbnail: {},
  };
  constructor(settings: NotificationSettings = null) {
    if (settings) {
      this.settings = settings;
      this.webhook = this.baseWebhook(this.settings.webhook_url);
      this.createBaseMessage();
    }
  }

  baseWebhook(webhookUrl: string) {
    const webhook = new Webhook(webhookUrl);
    return webhook;
  }

  createBaseMessage() {
    this.message.thumbnail = {
      url: this.settings.logo_url,
      height: 30,
      width: 30,
    };
    this.message.title = "BRPanel";
    this.message.url = this.settings.community_website;
  }

  async onSale({
    data: { customer_steamid, cargo_name, server },
    what,
  }: IOnSale) {
    if (what === "cargo") {
      this.message.title = "Nova compra de cargo";
      this.message.fields.push({ name: "Usuário:", value: customer_steamid });
      this.message.fields.push({ name: "Cargo:", value: cargo_name });
      this.message.fields.push({ name: "Servidor:", value: server });
    }
    try {
      await this.webhook.send("", [this.message]);
    } catch (e) {
      console.log("error on onSale");
      console.error(e);
    }
  }

  async onModification({ activity, additionalInfo, createdBy }: IPanelUpdate) {
    try {
      this.message.title = "Painel modificado";
      this.message.fields.push({ name: "Atividade:", value: activity });
      this.message.fields.push({
        name: "Informações adicionais:",
        value: additionalInfo,
      });
      this.message.fields.push({ name: "Feita por:", value: createdBy });
      await this.webhook.send("", [this.message]);
    } catch (e) {
      console.log("error on onSale");
      console.error(e);
    }
  }

  async testMessage() {
    try {
      this.webhook.send("", [this.message]);
    } catch (e) {
      console.error("error on testMessage", e);
    }
  }
}

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";


export default {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong')
  }
}

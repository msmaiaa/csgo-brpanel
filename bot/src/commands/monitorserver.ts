import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { ClientWithCommands } from '../index'
import Gamedig from 'gamedig'
import { botDatabase } from "../database";

const ipRegex = new RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/m)

interface IRawData {
  protocol: number
  folder: string
  game: string
  appId: number
  numplayers: number
  numbots: number
  listentype: string
  environment: string
  secure: 1
  version: string
  steamid: string
  tags: Array<string>
}

interface IPlayerData {
  name: string
  raw: {
    score: number
    time: number
  }
}
export interface IResponseData {
  name: string
  map: string
  password: boolean
  raw: IRawData
  maxplayers: number
  players: Array<IPlayerData>
  bots: Array<any>
  connect: string
  ping: number
}

export default {
  data: new SlashCommandBuilder()
  .setName('monitorserver')
  .setDescription('Monitora o status de um servidor de csgo')
  .addStringOption((option) => option.setName('ip').setDescription("ip:porta")),
  async execute(client: ClientWithCommands, interaction: CommandInteraction) {
    try{
      const args = interaction.options.get("ip", true)
      const ip: any = args.value
      if(!ipRegex.test(ip)) {
        await interaction.reply('Ip inválido')
        return
      }
      const [serverIp, serverPort] = ip.split(":")
      const serverInfo: IResponseData = await Gamedig.query({
        type: 'csgo',
        host: serverIp,
        port: serverPort
      })
      console.log(serverInfo)
      const embed = new MessageEmbed()
      .setTitle(`Servidor: ${serverInfo.name} :white_check_mark:`)
      .setDescription(`Mapa: ${serverInfo.map}\n Slots: ${serverInfo.maxplayers}`)
      .setColor('#00ce00')
      .setTimestamp()
      .setFooter('Atualizado a cada 5 minutos')
      let playersNames: string = ''
      let scoreList: string = ''
      if(serverInfo.players.length > 0) {
        serverInfo.players.map((player) => {
          playersNames += `${player.name}\n`
          scoreList += `${player.raw.score.toString()}\n`
        })
        embed
        .addField("Jogadores", playersNames, true)
        .addField("Pontuação", scoreList, true)
        .addField("Conectar", `steam://connect/${ip}`)
      }else{
        embed.setFooter('Nenhum jogador no servidor\nAtualizado a cada 5 minutos')
      }
      const channelId = interaction.channelId
      const channel = client.channels.cache.get(channelId) as TextChannel
      const message = await channel.send({embeds: [embed]})
      await addServerToDb(message.guildId, channelId, message.id, ip)
      interaction.reply('Servidor adicionado, esta mensagem vai ser deletada em 2 segundos.')
      setTimeout(() => {
        interaction.deleteReply()
      }, 1000)
    }catch(e: any) {
      const error: TypeError = e
      console.error(e.message)
      if(error.name === "TypeError [COMMAND_INTERACTION_OPTION_NOT_FOUND]") {
        await interaction.reply('Uso correto: /monitorserver <ip:porta>')
      } else if(e.message === "Failed all 1 attempts") {
        await interaction.reply('O servidor precisa estar online para ser adicionado.')
      } else {
        await interaction.reply('Erro ao executar o comando.')
      }
    }
  }
}

const addServerToDb = async(guildId: string | null, channelId: string, messageId: string, ip: string) => {
  try{
    await botDatabase('servers')
    .insert({
      guildId: guildId,
      channelId,
      messageId: messageId,
      server_ip: ip
    })
  }catch(e) {
    console.error('error on addServerToDb', e)
  }
}

const generateEmbed = async(serverInfo: any) => {
  try{

  }catch(e) {
    console.error('error on generateEmbed', e)
  }
}
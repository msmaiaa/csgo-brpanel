import { Client, TextChannel } from 'discord.js'
import cron from 'node-cron'
import { IResponseData } from '../commands/monitorserver'
import Gamedig from 'gamedig'
import { botDatabase, panelDatabase } from "../database"


//
export const verifyExpiredCargos = async() => {
  try{
    const currentTimestamp = Math.floor(Date.now() / 1000)
    await panelDatabase.raw(`
    DELETE FROM user_cargo WHERE expire_stamp < ${currentTimestamp}
    `)
  }catch(e) {
    console.error('Error on verifyExpiredCargos', e)
  }
}


//
interface IServersQueryResponse {
  id: number
  guildId: string
  channelId: string
  messageId: string
  server_ip: string
}
export const updateServersStatus = async(client: Client) => {
  try{
    const data: Array<IServersQueryResponse> = await botDatabase('servers')
    for(let d of data) {
      try{
        const channel = new TextChannel(d.guildId as any, { id: d.channelId } as any, client)
        const [serverIp, serverPort] = d.server_ip.split(":")
        const oldEmbedMessage = await channel.messages.fetch(d.messageId)
        const oldEmbed = oldEmbedMessage.embeds[0]
        oldEmbed.fields = []
        try{
          const serverInfo: IResponseData = await Gamedig.query({
            type: 'csgo',
            host: serverIp,
            port: serverPort
          })
          oldEmbed
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
            oldEmbed
            .addField("Jogadores", playersNames, true)
            .addField("Pontuação", scoreList, true)
            .addField("Conectar", `steam://connect/${d.server_ip}`)
          }else{
            oldEmbed.setFooter('Nenhum jogador no servidor\nAtualizado a cada 5 minutos')
          }
        }catch(e) {
          const oldTitle: Array<string> | undefined = oldEmbed.title?.split(" ")
          oldTitle?.pop()
          oldTitle?.shift()
          oldEmbed
          .setTitle(`Servidor: ${oldTitle?.join(" ")} :x:`)
          .setDescription('O servidor está offline, contate os administradores.')
          .setColor('#ff0000')
          .setTimestamp()
        }
        await channel.messages.edit(d.messageId, { embeds: [oldEmbed] })
      }catch(e:any) {
        if(e.code === 10008) {
          await botDatabase('servers')
          .where({ id: d.id })
          .del()
        }
      }
    }
  }catch(e) {
    console.error('Error on updateServersStatus', e)
  }
}

export const startCronJobs = async(client: Client) => {
  try{
    cron.schedule('*/25 * * * *', () => updateServersStatus(client))
    cron.schedule('*/25 * * * *', verifyExpiredCargos)
    //task.start()
  }catch(e) {
    console.error('Error on startCronJobs', e)
  }
}
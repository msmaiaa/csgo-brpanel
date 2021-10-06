import dotenv from 'dotenv'
dotenv.config()
import { Client, ClientOptions, Collection, Intents, Interaction } from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { botDatabase, createBotTables } from './database'

import Commands from './commands'
import { startCronJobs } from './cronjobs'

//extend the client so that we can have some commands 
export class ClientWithCommands extends Client {
  //TODO: type the commands
  public commands: Collection<any, any>

  constructor(options: ClientOptions) {
    super(options)
    this.commands = new Collection()
  }
}

const registerCommandsInGroups = async() => {
  try{
    const commands = []
    for(let c of  Object.keys(Commands)) {
      const command = Commands[c]
      commands.push(command.data.toJSON())
    }

    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN as string);

      await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
      { body: commands },
    );
    console.log('Comandos registrados')
  }catch(e) {
    console.error('Error on updateCommandsInServer', e)
  }
}

const main = async () => {
  await registerCommandsInGroups()
  const client = new ClientWithCommands({ intents: [Intents.FLAGS.GUILDS] })
  try {
    await botDatabase('servers')
  }catch(e: any) {
    if(e.errno === 1146) {
      await createBotTables()
    }
    console.error(e)
  }

  startCronJobs(client)

  client.commands = new Collection()
  for(let c of  Object.keys(Commands)) {
    client.commands.set(c, Commands[c])
  }

  client.on('ready', async() => {
    console.log('Bot conectado')
  })

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return

    try {
      await command.execute(client, interaction)
    }catch(e) {
      console.error(e)
      await interaction.reply({ content: 'Você é burro? Esse comando não existe.', ephemeral: true})
    }
  });
  client.login(process.env.BOT_TOKEN)
}

main()

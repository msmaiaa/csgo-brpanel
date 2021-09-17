import dotenv from 'dotenv'
dotenv.config()
import { Client, Collection, Intents, Interaction } from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import Commands from './commands'

const commands = []
for(let c of  Object.keys(Commands)) {
  const command = Commands[c]
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN as string);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
    { body: commands },
  );
  console.log('Registered application commands')

  const client: any = new Client({ intents: [Intents.FLAGS.GUILDS] })
  
  client.commands = new Collection()
  for(let c of  Object.keys(Commands)) {
    client.commands.set(c, Commands[c])
  }

  client.on('ready', () => {
    console.log('Bot conectado')
  })

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
  
    const command = client.commands.get(interaction.commandName);

    if(!command) return

    try {
      await command.execute(interaction)
    }catch(e) {
      console.error(e)
      await interaction.reply({ content: 'Você é burro? Esse comando não existe.', ephemeral: true})
    }

  });
  
  client.login(process.env.BOT_TOKEN)
})();
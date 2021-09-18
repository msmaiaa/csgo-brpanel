import { knex } from 'knex'

const connectionConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as any),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

export const botDatabase = knex({
  client: 'mysql2',
  connection: {
    ...connectionConfig,
    database: 'brpanel_bot'
  }
})

export const panelDatabase = knex({
  client: 'mysql2',
  connection: {
    ...connectionConfig,
    database: 'brpanel'
  }
})

export const createBotTables = async() => {
  try{
    botDatabase.schema.createTable('servers', (table) => {
      table.increments('id').primary()
      table.string('guildId')
      table.string('channelId')
      table.string('messageId')
      table.string('server_ip')
    })
    .then(() => {
      console.log('Tabelas criadas no banco de dados')
    })
  }catch(e) {
    console.error('Error on createBotDatabase')
  }
}
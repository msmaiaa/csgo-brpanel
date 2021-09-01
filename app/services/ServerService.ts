import axios from 'axios'

interface IAddServer {
  full_name: string
  name: string
  ip: string
  port: string
  rcon_pass: string
}

export async function addServer(data: IAddServer){
  return await axios.post('/api/servers/create', data)
}

export async function getAllServers() {
  return await axios.get('/api/servers/')
}
import axios from 'axios'


export interface IServer {
  full_name: string
  name: string
  ip: string
  port: string
  rcon_pass?: string
  created_at?: string
  updated_at?: string
}

export async function addServer(data: IServer){
  return axios.post('/api/servers/create', data)
}

export async function updateServer(data: IServer){
  return axios.post('/api/servers/update', data)
}

export async function getAllServers() {
  return axios.get('/api/servers/')
}

export async function getAllServersWithRcon() {
  return axios.get('/api/servers?rcon=true')
}

export async function getAllServersWithCargo() {
  return axios.get('/api/servers/withCargo')
}

export async function getServerStatus(server) {
  return axios.post('/api/servers/getstatus', {server})
}

export async function deleteServer(server) {
  return axios.delete('/api/servers/delete', {data: server})
}
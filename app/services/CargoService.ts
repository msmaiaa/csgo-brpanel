import axios from 'axios'

export interface ICargo {
  stripe_id: string
  name: string
  price: string
  duration: string
  individual: boolean
  currency: string
  flags: string
  id?: string
  created_at?: string
  updated_at?: string
  serverName?: string
  cargo_server?: [any]
}

export async function addCargo(cargo: ICargo, servers: Array<any>){
  return await axios.post('/api/cargos/create', {cargo, servers})
}

export async function updateCargo(cargo: ICargo){
  return await axios.post('/api/cargos/update', {cargo})
}

export async function getAllCargos(){
  return await axios.get('/api/cargos/')
}

export async function buyCargo(cargo: ICargo){
  return await axios.post('/api/cargos/buy', {cargo})
}

export async function deleteCargo(cargo: ICargo){
  return await axios.post('/api/cargos/delete', {cargo})
}
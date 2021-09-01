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
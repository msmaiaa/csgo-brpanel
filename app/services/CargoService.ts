import axios from 'axios'

interface ICargo {
  stripe_id: string
  name: string
  price: string
  individual: boolean
  currency: string
  flags: string
}

export async function addCargo(cargo: ICargo, servers: Array<any>){
  return await axios.post('/api/cargos/create', {cargo, servers})
}
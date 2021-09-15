import axios from 'axios'
import { IServer } from './ServerService'
import { IUser } from './UserService'

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

interface IAddUser {
  cargo: ICargo
  days: number
  user: IUser
  server: IServer | string
}

export async function addCargo(cargo: ICargo, servers: Array<any>){
  return axios.post('/api/cargos/create', {cargo, servers})
}

export async function updateCargo(cargo: ICargo){
  return axios.post('/api/cargos/update', {cargo})
}

export async function getAllCargos(){
  return axios.get('/api/cargos/')
}

export async function getNonIndividualCargos(){
  return axios.get('/api/cargos?all=true')
}

export async function buyCargo(cargo: ICargo, gateway){
  return axios.post('/api/cargos/buy', {cargo, gateway})
}

export async function deleteCargo(cargo: ICargo){
  return axios.post('/api/cargos/delete', {cargo})
}

export async function removeCargosFromUser(user: IUser){
  return axios.post('/api/cargos/removeFromUser', {user, all: true})
}

export async function addCargosToUser(dataAddUser: IAddUser){
  return axios.post('/api/cargos/addToUser', {...dataAddUser})
}
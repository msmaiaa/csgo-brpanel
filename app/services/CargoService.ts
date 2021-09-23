import axios from 'axios'
import { IAddUser, ICargo, IUser } from 'types'


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
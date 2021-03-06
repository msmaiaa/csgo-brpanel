import axios from 'axios'

export interface ICreateUser {
  steamid: string
  user_type: number
  username: string
}

export async function getAllUsers(page) {
  return axios.get(`/api/users?page=${page}`)
}

export async function getUserById(id) {
  return axios.get(`/api/users?id=${id}`)
}

export async function createUser(data: ICreateUser) {
  return axios.post('/api/users/create', {data})
}

export async function updateUser(id: number, data: any) {
  return axios.post('/api/users/update', {id, data})
}

export async function getUserStatus() {
  return axios.get('/api/users/status')
}
import axios from 'axios'

export interface IUser {
  name: string
  id: number
  steamid: string
  user_type: number
  created_at?: string
  updated_at?: string
}

export interface ICreateUser {
  steamid: string
  user_type: number
  username: string
}

export async function getAllUsers(page) {
  return axios.get(`/api/users?page=${page}`)
}

export async function createUser(data: ICreateUser) {
  return axios.post('/api/users/create', {data})
}
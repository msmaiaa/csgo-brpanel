import axios from 'axios'

export async function getSteamUserData(data){
  return axios.post('/api/steam/user', {data})
}
import axios from 'axios'

export async function getAllLogs(page) {
  return await axios.get(`/api/logs?page=${page}`)
}
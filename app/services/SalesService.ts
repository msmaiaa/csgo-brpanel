import axios from 'axios'

export async function getAllSales(page) {
  return axios.get(`/api/sales?page=${page}`)
}
import axios from "axios"

interface ISettingsScope {
  scope: "notifications"
}

export async function getAllSettings(scope) {
  return axios.get('/api/settings?scope=' + scope)
}

export async function updateSettings(data) {
  return axios.post('/api/settings/update', {...data})
}

export async function testDiscordHook(url: string) {
  return axios.post('/api/discord/test', {url}, {timeout: 3000})
}

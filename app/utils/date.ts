export function epochTillExpirationDate(days) {
  let currentEpoch = Math.floor(Date.now() / 1000)
  let daysInSec = Math.floor(days * 86400)
  return (currentEpoch + daysInSec)
}

export function addDaysToTimestamp(days, timestamp) {
  const timestampToDate = new Date(Number(timestamp) * 1000)
  timestampToDate.setDate(timestampToDate.getDate() + days)
  return BigInt(timestampToDate.getTime() / 1000)
}
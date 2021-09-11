import router from '../../../lib/router'
import prisma from '../../../lib/prisma'
import requireAuth from '../../../middlewares/auth/requireAuth'
import requireAdmin from '../../../middlewares/auth/requireAdmin'
import { logInDb } from '../../../lib/logger'

const path = '/api/cargos/addToUser'

function epochTillExpirationDate(days): any {
  let currentEpoch = Math.floor(Date.now() / 1000)
  let daysInSec = Math.floor(days * 86400)
  return (currentEpoch + daysInSec)
}

function addDaysToTimestamp(days, timestamp) {
  const timestampToDate = new Date(Number(timestamp) * 1000)
  timestampToDate.setDate(timestampToDate.getDate() + days)
  return BigInt(timestampToDate.getTime() / 1000)
}

router.post(path, requireAuth, requireAdmin, async(req: any, res: any) => {
  try{
    const body: any = req.body
    if(body.server === 'all') { 
      const foundServers = await prisma.server.findMany()
      for(let server of foundServers) {
        const foundUserCargo = await prisma.user_Cargo.findFirst({
          where: {
            server_name: server.name,
            steamid: body.user.steamid
          }
        })
        // user has cargo ? update with new data : insert new user_cargo
        if(foundUserCargo) {
          const daysToAdd = body.days
          const newCargoTimestamp = addDaysToTimestamp(daysToAdd, foundUserCargo.expire_stamp)
          await prisma.user_Cargo.update({
            where: {
              id: foundUserCargo.id
            },
            data: {
              expire_stamp: newCargoTimestamp,
              flags: body.cargo.flags,
              cargo_id: body.cargo.id,
            }
          })
          logInDb('Cargo do usuário atualizado', `${body.cargo.name} - ${body.user.steamid}`, req.user.personaname) 
        }else{
          await prisma.user_Cargo.create({
            data: {
              expire_stamp: epochTillExpirationDate(body.days),
              cargo_id: body.cargo.id,
              flags: body.cargo.flags,
              server_name: server.name,
              steamid: body.user.steamid
            }
          })
          logInDb('Cargo adicionado ao usuário', `${body.cargo.name} - ${body.user.steamid}`, req.user.personaname)
        }
      }
    }else {
      const foundUserCargo = await prisma.user_Cargo.findFirst({
        where: {
          server_name: body.server.name,
          steamid: body.user.steamid
        }
      })
      if(foundUserCargo) {
        const daysToAdd = body.days
        const newCargoTimestamp = addDaysToTimestamp(daysToAdd, foundUserCargo.expire_stamp)
        await prisma.user_Cargo.update({
          where: {
            id: foundUserCargo.id
          },
          data: {
            expire_stamp: newCargoTimestamp,
            flags: body.cargo.flags,
            cargo_id: body.cargo.id,
          }
        })
        logInDb('Cargo do usuário atualizado', `${body.cargo.name} - ${body.user.steamid}`, req.user.personaname)
      }else{
        await prisma.user_Cargo.create({
          data: {
            expire_stamp: epochTillExpirationDate(body.days),
            cargo_id: body.cargo.id,
            flags: body.cargo.flags,
            server_name: body.server.name,
            steamid: body.user.steamid
          }
        })
        logInDb('Cargo adicionado ao usuário', `${body.cargo.name} - ${body.user.steamid}`, req.user.personaname)
      }
    }
    return res.status(200).json({message: 'Cargo(s) adicionado(s) ao usuário.'})
  }catch(e) {
    console.log(e)
    return res.status(500).json({message: 'Error ao adicionar cargo(s) ao usuário.'})
  }
})

export default router
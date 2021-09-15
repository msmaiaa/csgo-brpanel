import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

interface IFindUsersWithCargo {
  orderBy: "desc" | "asc"
  skipCount: number,
  take: number
}

interface IUpdateUser {
  where: object
  data: object
}

export default new class User {
  create (data) {
    return prisma.user.create(data)
  }

  findOne (data: Prisma.UserFindFirstArgs) {
    return prisma.user.findFirst(data)
  }

  findAllWithUserCargo (data: IFindUsersWithCargo) {
    return prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        take: data.take,
        skip: data.skipCount,
        orderBy: {
          created_at: data.orderBy
        },
        include: {
          user_cargo: {
            include: {
              server: true,
              cargo: true
            }
          }
        }
      })
    ])
  }

  update (data: IUpdateUser) {
    return prisma.user.update(data)
  }
}
import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

export default new class CargoServer {
  findMany(data: Prisma.Cargo_ServerFindManyArgs) {
    return prisma.cargo_Server.findMany(data)
  }

  create(data: Prisma.Cargo_ServerCreateArgs) {
    return prisma.cargo_Server.create(data)
  }

  createMany(data: Prisma.Cargo_ServerCreateManyArgs) {
    return prisma.cargo_Server.createMany(data)
  }

  deleteAll() {
    return prisma.cargo_Server.deleteMany()
  }

  deleteMany(data: Prisma.Cargo_ServerDeleteManyArgs) {
    return prisma.cargo_Server.deleteMany(data)
  }
}
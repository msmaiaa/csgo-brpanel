import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

export default new class Server {
  findAll() {
    return prisma.server.findMany()
  }

  findManyWithCargoServer (data: Prisma.ServerFindManyArgs) {
    return prisma.server.findMany(data)
  }

  create (data: Prisma.ServerCreateArgs) {
    return prisma.server.create(data)
  }

  update(data: Prisma.ServerUpdateArgs) {
    return prisma.server.update(data)
  }

  delete (data: Prisma.ServerDeleteArgs) {
    return prisma.server.delete(data)
  }
}
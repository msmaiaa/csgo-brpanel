import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

interface IFindOneCargo {
  where: object
}

export default new class Cargo {
  findOne (data: IFindOneCargo) {
    return prisma.cargo.findFirst(data)
  }

  findMany(data: Prisma.CargoFindManyArgs) {
    return prisma.cargo.findMany(data)
  }

  createOne(data: Prisma.CargoCreateArgs) {
    return prisma.cargo.create(data)
  }

  update (data: Prisma.CargoUpdateArgs) {
    return prisma.cargo.update(data)
  }

  deleteWhere(data: Prisma.CargoDeleteArgs) {
    return prisma.cargo.delete(data)
  }
}
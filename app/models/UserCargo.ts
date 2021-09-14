import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

interface IFindOneUserCargo {
  where: object
}

export default new class UserCargo {
  findOne (data: IFindOneUserCargo) {
    return prisma.user_Cargo.findFirst(data)
  } 

  update (data: Prisma.User_CargoUpdateArgs) {
    return prisma.user_Cargo.update(data)
  }

  updateMany (data: Prisma.User_CargoUpdateManyArgs) {
    return prisma.user_Cargo.updateMany(data)
  }

  deleteMany (data: Prisma.User_CargoDeleteManyArgs) {
    return prisma.user_Cargo.deleteMany(data)
  }

  create (data: Prisma.User_CargoCreateArgs) {
    return prisma.user_Cargo.create(data)
  }

  findMany (data: Prisma.User_CargoFindManyArgs) {
    return prisma.user_Cargo.findMany(data)
  }
}
import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

interface IFindLogsWithPagination {
  orderBy: "desc" | "asc"
  skipCount: number,
  take: number
}


export default new class Log {
  findAllWithPagination(data: IFindLogsWithPagination) {
    return prisma.$transaction([
      prisma.log.count(),
      prisma.log.findMany({
        take: data.take,
        skip: data.skipCount,
        orderBy: {
          created_at: data.orderBy
        }
      })
    ])
  }

  create (data: Prisma.LogCreateArgs) {
    return prisma.log.create(data)
  }
}
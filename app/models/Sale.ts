import { Prisma } from '.prisma/client'
import prisma from 'lib/prisma'

interface IFindSalesWithPagination {
  orderBy: "desc" | "asc"
  skipCount: number,
  take: number
}

export default new class Sale {
  findAllWithPagination(data: IFindSalesWithPagination) {
    return prisma.$transaction([
      prisma.sale.count(),
      prisma.sale.findMany({
        take: data.take,
        skip: data.skipCount,
        orderBy: {
          created_at: data.orderBy
        }
      })
    ])
  }

  create (data: Prisma.SaleCreateArgs) {
    return prisma.sale.create(data)
  }

  update (data: Prisma.SaleUpdateArgs) {
    return prisma.sale.update(data)
  }

  findAllByUser (data) {
    return prisma.sale.findMany({
      where: {
        customer_steamid: data.steamid
      }
    })
  }

  findById (id) {
    return prisma.sale.findFirst({
      where: {
        id
      }
    })
  }
}
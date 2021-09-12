import prisma from 'lib/prisma'

interface IFindOrCreateSettings {
  where: object
  create: object
  update: object
}

interface IUpdateSettings {
  where: object
  data: object
}

export default new class NotificationSettings {
  findOrCreate(data: IFindOrCreateSettings) {
    return prisma.notificationSettings.upsert(data)
  }

  update(data: IUpdateSettings) {
    return prisma.notificationSettings.update(data)
  }
}
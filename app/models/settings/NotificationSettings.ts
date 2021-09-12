import prisma from 'lib/prisma'

interface IUpdateSettings {
  where: object
  data: object
}

export default new class NotificationSettings {
  findOrCreate(data?) {
    return prisma.notificationSettings.upsert(data)
  }

  findOne() {
    return prisma.notificationSettings.findFirst()
  }

  update(data: IUpdateSettings) {
    return prisma.notificationSettings.update(data)
  }
}
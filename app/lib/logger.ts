import prisma from './prisma'

export async function logInDb (activity, additionalInfo, createdBy) {
  try{
    await prisma.log.create({
      data: {
        activity,
        additional_info: additionalInfo,
        created_by: createdBy
      }
    })
  }catch(e) {
    console.error('Error while trying to log data')
    console.error(e)
  }
}


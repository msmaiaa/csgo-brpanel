import Log from 'models/Log'

export async function logInDb (activity, additionalInfo, createdBy) {
  try{
    await Log.create({
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


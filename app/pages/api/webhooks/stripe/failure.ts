import router from '../../../../lib/router'

const path = '/api/webhooks/stripe/failure'
router.post(path, (req, res) => {
  try{
    //todo
    return res.status(200).json({
      received: true
    })
  }catch(e) {
    console.error(e)
    return res.status(500).json({message: e.message})
  } 
})

export default router
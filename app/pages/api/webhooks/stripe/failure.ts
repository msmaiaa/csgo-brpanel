import router from 'lib/router'
import { ApiRequest, ApiResponse } from "types"
import { ApiRequest, ApiResponse } from "types"

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
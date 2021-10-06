import { ApiRequest, ApiResponse } from "types"

const requireAdmin = (req: ApiRequest, res: ApiResponse, next) => {
  if(!req.user) return res.status(401).json({message: 'Not logged in'})
  if(req.user.user_type < 1) return res.status(401).json({message: 'Not authorized, are you trying to do bad stuff? >:('})
  next()
}

export default requireAdmin
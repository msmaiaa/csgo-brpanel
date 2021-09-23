import { ApiRequest, ApiResponse } from "types"

const requireAuth = (req: ApiRequest, res: ApiResponse, next) => {
  if(!req.user) return res.status(401).json({message: 'Not logged in'})
  next()
}

export default requireAuth
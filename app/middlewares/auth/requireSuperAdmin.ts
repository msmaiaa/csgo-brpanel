const requireSuperAdmin = (req, res, next) => {
  if(!req.user) return res.status(401).json({message: 'Not logged in'})
  if(req.user.user_type < 2) return res.status(401).json({message: 'Not authorized, are you trying to do bad stuff? >:('})
  next()
}

export default requireSuperAdmin
const requireAdmin = (req, res, next) => {
  if(req.user.user_type < 1) return res.status(401).json({message: 'Not authorized, are you trying to do bad stuff? >:('})
  next()
}

export default requireAdmin
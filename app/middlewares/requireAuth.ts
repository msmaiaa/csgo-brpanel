const requireAuth = (req, res, next) => {
  if(!req.user) return res.status(401).json({message: 'Not logged in'})
  next()
}

export default requireAuth
const CustomError = require('../errors')
const {isTokenValid} = require('../utils')


const authenticateUser = async (req, res, next) => {
	//Note: we have access to req.signedCookies because in the app.js we signed our app like this  app.use(cookieParser(process.env.JWT_SECRET))

	const token = req.signedCookies.token;

	if (!token) {
		throw new CustomError.UnauthenticatedError('Authentication Invalid');
	}
  try {
    const payload = isTokenValid({token})
    req.user = { name: payload.name, userId: payload.userId, role: payload.role };
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
	next();
}


const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      throw new CustomError.UnauthorizedError('Unauthorized to access this route')
    }
  next();
  }
  
}



module.exports = { 
  authenticateUser,
  authorizePermissions
}
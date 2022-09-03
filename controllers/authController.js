const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse, createTokenUser} =require('../utils')



const login = async (req, res) => {
  const {email, password} = req.body

  if(!email || !password) {
    throw new CustomError.BadRequestError(
			'Please provide an Email and Password'
		);
  }
  const user = await User.findOne({email})

  if(!user){
    throw new CustomError.UnauthenticatedError('Invalid Credential');
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError('Invalid Credential');
	}

  //So we replace the code below with with this one 
  const tokenUser = createTokenUser(user);
  // const tokenUser = { name: user.name, userId: user._id, role: user.role };

	attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
}


const register = async (req, res) => {
	const { email, name, password } = req.body;
	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exists');
	}

	// First registered user is an admin
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? 'admin' : 'user';
	const user = await User.create({ name, email, password, role });

	//So we replace the code below with with this one
	const tokenUser = createTokenUser(user);
	// const tokenUser = { name: user.name, userId: user._id, role: user.role };
  
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.CREATED).json({ user: tokenUser });
}



const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  //We don't really have to send back anything when we are login out but for testing we will send this 

  res.status(StatusCodes.OK).json({msg:'User logged out'})
}


module.exports = {
  login, register, logout
}
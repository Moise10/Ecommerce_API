const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const {createTokenUser, attachCookiesToResponse, checkPermissions} = require('../utils')



const getAllUsers = async (req, res) =>{
  console.log(req.user)
  const user = await User.find({role:'user'}).select('-password')
  res.status(StatusCodes.OK).json({user})
}


const getSingleUser = async (req, res) =>{
  
  const {
		params: { id: userId },
	} = req;

  const user = await User.findOne({ _id: userId }).select('-password');

  if(!user){
    throw new CustomError.NotFoundError(`No user found for id: ${id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({user});
}


const showCurrentUser = (req, res) =>{
  
  res.status(StatusCodes.OK).json({user: req.user})
}




const updateUserPassword = async (req, res) =>{
  const {oldPassword, newPassword} = req.body

  if(!oldPassword || !newPassword){
    throw new CustomError.BadRequestError('Please provide both values')
  }
  const user = await User.findOne({_id: req.user.userId})

  const isPasswordCorrect = await user.comparePassword(oldPassword)

  if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('invalid Credentials')
  }

  user.password = newPassword

  await user.save()
  res.status(StatusCodes.OK).json({mgs:'Success! Password updated'})
}


// Updating a user using user.save()

const updateUser = async (req, res) =>{
  const {email, name} = req.body

  if(!email || !name){
    throw new CustomError.BadRequestError('Please fill both values')
  }

  const user = await User.findOne({_id: req.user.userId})
  user.email = email 
  user.name = name
  await user.save()

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({user: tokenUser});
}




module.exports = {
  getAllUsers, 
  getSingleUser, 
  showCurrentUser,
  updateUser,
  updateUserPassword
}



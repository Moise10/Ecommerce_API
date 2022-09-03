const express = require('express')
const router = express.Router()
const {authenticateUser, authorizePermissions} = require('../middleware/authentication')

const {getAllUsers, 
  getSingleUser, 
  showCurrentUser,
  updateUser,
  updateUserPassword} = require('../controllers/userController')

//The placement of these middleware is very important , we first want to authenticate the user then we check if they are authorized
router.route('/').get(authenticateUser,authorizePermissions('admin', 'user') ,getAllUsers);
router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser,getSingleUser);

module.exports = router
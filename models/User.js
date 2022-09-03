const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, 'Please provide a email'],
		validate: {
			validator: validator.isEmail,
			message: 'Please provide a valid Email address',
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 6,
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
});


UserSchema.pre('save', async function () {
	//console.log(this.modifiedPaths())
	if(!this.isModified('password')) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//Comparing the password 

UserSchema.methods.comparePassword = async function(canditatePassword){
	const isMatch = await bcrypt.compare(canditatePassword, this.password)
	return isMatch
}

module.exports = mongoose.model('User', UserSchema);
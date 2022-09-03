const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'please add a name'],
			maxlength: [100, 'name can not be more than 100 characters'],
		},
		price: {
			type: Number,
			required: [true, 'please provide product price'],
			default: 0,
		},
		description: {
			type: String,
			required: [true, 'please add a description'],
			maxlength: [1000, 'name can not be more than 100 characters'],
		},
		image: {
			type: String,
			default: '/uploads/example.jpeg',
		},
		category: {
			type: String,
			required: [true, 'please provide product category'],
			enum: ['office', 'kitchen', 'bedroom'],
		},
		company: {
			type: String,
			required: [true, 'please provide product company'],
			enum: {
				values: ['ikea', 'liddy', 'marcos'],
				message: '{VALUE} is not supported',
			},
		},
		colors: {
			type: [String],
			required: true,
			default: ['#434343']
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			required: true,
			default: 10,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews:{
			type: Number,
			default: 0
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: ' User ',
			required: true,
		},
	},
	{ timestamps: true, toJSON:{ virtuals: true}, toObject: {virtuals: true} }
);

// ProductSchema.virtual('reviews', {
// 	ref: 'Review',
// 	localField:'_id',
// 	foreignField: 'product',
// 	justOne: false
// })


ProductSchema.pre('remove', async function(next){
	//So here it says , when i am removing the product i want to access the Review model , then in the deleteMany , we want to specifically say what reviews we want to remove , and we want to remove in the case the reviews where product matches this._id.We use product because that's the property on the review model that references the product , and that is why in the deleteProduct controller we used  await product.remove()
	await this.model('Review').deleteMany({product: this._id})
})

module.exports = mongoose.model('Product', ProductSchema);
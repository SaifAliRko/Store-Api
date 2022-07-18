const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'product name is required']
    },
    price: {
        type: Number,
        required: [true, 'product price is required']
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported'
        }
    }
})
const Product = mongoose.model('Product', productsSchema)
module.exports = Product
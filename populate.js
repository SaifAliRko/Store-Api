const connectDB = require('./db/connect')
const jsonProducts = require('./products.json')
require('dotenv').config()
const Product = require('./models/product')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log('Success')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

start()
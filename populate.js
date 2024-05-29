const mongoose = require('mongoose')
const productModel = require('./model/products')
const productReq = require('./products.json')
require('dotenv').config()
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        await productModel.deleteMany()
        await productModel.create(productReq)
        console.log('Task completed!')
        process.exit(0)
    } catch (error) {
        console.log("Error in populate:", error)
        process.exit(1)
    }

}

start()
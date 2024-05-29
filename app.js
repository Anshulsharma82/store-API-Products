require('dotenv').config()
require('express-async-errors') // Will handle Errors // Using this to avoid try-catch...

const express = require('express')
const app= express()
const dbConnect = require('./db/connect')
const productRoute = require('./routes/products')
const notFound = require('./middleware/notFound')
const errorHandle = require('./middleware/error')

app.use(express.json())
app.get('/', (req,res) => {
   return res.status(200).send(`<h1>Store API</h1> <a href = '/api/v1/products'>Products Route</a>`)
})

app.use('/api/v1/products', productRoute)


app.use(notFound) // Should be last app.use()
app.use(errorHandle) // Should be last app.use()

const PORT = process.env.PORT || 8080
const start = async () => {
    try {
        await dbConnect(process.env.MONGO_URL)
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}...`)
        })
    } catch (err) {
        console.log('Error in app', err)
    }
}

start();
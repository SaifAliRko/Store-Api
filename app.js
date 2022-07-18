require('dotenv').config()
const express = require('express');
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const productsRouter = require('./routes/products');
const app = express();

const port = process.env.PORT || 3000

app.use(express.json())


//Router
app.use('/api/v1/products/', productsRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const start = async () => {
    try {
        //connect to DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening at port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }

}
start()
const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT || 5000


app.use(express.json())
app.use('/api',userRouter)

app.listen(port, () => {
    console.log('Server is listening on port: ' + port)
})


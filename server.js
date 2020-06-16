const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT = 5065

app.use(bodyParser.urlencoded({ extended: true }))

const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

const blogRouter = require('./routes/blog')
app.use('/blog', blogRouter)

app.listen(PORT, ()=>{
  console.log('Server is up and running', PORT)
})

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT = 6700

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cors())


const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

const blogRouter = require('./routes/blog')
app.use('/blog', blogRouter)

app.listen(PORT, ()=>{
  console.log('Server is up and running', PORT)
})

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path= require("path")

const app = express()

const PORT = process.env.PORT = 6700

app.use(express.static(path.join(__dirname, "client/build")))

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cors())

const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

const blogRouter = require('./routes/blog')
app.use('/blog', blogRouter)

console.log(__dirname+'/know/src/images')

app.listen(PORT, ()=>{
  console.log('Server is up and running', PORT)
})

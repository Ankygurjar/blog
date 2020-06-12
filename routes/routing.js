const Pool = require('pg').Pool
const multer = require('multer')
const router = require('express').Router()
const bcryt = require('bcryptjs')

const pool = new Pool({
  user: "ankit",
  host: "localhost",
  database: "blog",
  password: "admin",
  port: 5432
})

router.get('/', (req, res)=>{
  res.json('Api is working')
})

module.exports = router

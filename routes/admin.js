const Pool = require('pg').Pool
const multer = require('multer')
const router = require('express').Router()
const bcryt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pool = new Pool({
  user: "ankit",
  host: "blog-1.cthkqb1wuvvt.us-east-2.rds.amazonaws.com",
  database: "blogging",
  password: "Mukeshmaa",
  port: 5432
})

process.env.SECRET_KEY = 'topSecret'
var today = new Date()


var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname+'-'+ Date.now()+'.png')
  }
})

var upload = multer({ storage: storage })

router.get('/getAdmins', (req, res)=>{
  const query = "SELECT * FROM my_admin"

  pool.query(query)
    .then((data)=>{
      res.status(200).json(data.rows)
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})

router.get('/myAdmin/:id', (req, res)=>{
  const id = req.params.id
  console.log(id)
  const query = "SELECT * FROM my_admin WHERE user_id = $1"

  pool.query(query, [id])
    .then((data)=>{
      res.status(200).json(data.rows)
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})

router.post('/addAdmin', upload.single('picture'),(req, res)=>{

  var dateTime = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+"  "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()
  console.log(req.file)
    let data = {
      name : req.body.name,
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
      email: req.body.email,
      role: req.body.role,
      profile_picture: req.file.filename
    }

    if( data.name!= '' && data.username!= '' && data.password!= '' && data.email!= '' && data.profile_picture!= '' && data.password2!='' ){
    if(data.password === data.password2){
      bcryt.genSalt(10, (err, salt)=>{
        bcryt.hash(data.password, salt, (err, hash)=>{
          if(err) throw err;
          data.password = hash
          console.log(data)
          pool.query('INSERT INTO my_admin(name, username, password, email, role, profile_picture) VALUES($1, $2, $3, $4, $5, $6)', [data.name, data.username, data.password, data.email, data.role, data.profile_picture], (err, user)=>{
            if(err){
              res.status(400).json(err)
            }else{
              res.status(200).json('User has been added')
              pool.query("COMMIT TRANSACTION")
            }
          })
        })
      })
    }else{
      res.status(400).json("You passwords are not same")
    }
  }else{
    res.status(400).json('Please Enter all the details')
  }
})

router.post('/login', (req, res)=>{
  const user = {
    email: req.body.email
  }
  const query="SELECT * FROM my_admin WHERE email = $1"
  pool.query(query, [user.email])
    .then((user)=>{
      if((user.rows).length < 1){
        res.status(404).json({error:"User with this email is not found!!"})
      }else{
        if(bcryt.compareSync(req.body.password, user.rows[0].password)){
          const payload = {
            _id: user.rows[0].user_id,
            name: user.rows[0].username,
            email: user.rows[0].email
          }
          var token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: 56780})
          return res.status(200).json({token: token})
        }else{
          res.status(400).json({error: "Password is not correct!!"})
        }
      }
    })
    .catch((err)=>{
      res.status(400).json({error: err})
    })
})

router.put('/updateAdmin/:id', upload.single('profile_picture'),(req, res)=>{

  const id = req.params.id

  const updateUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
    profile_picture: req.file.filename
  }

  if(updateUser.username != '' && updateUser.password != '' && updateUser.email != '' && updateUser.role != ''){
    bcryt.genSalt(10, (err, salt)=>{
      bcryt.hash(updateUser.password, salt,(err, hash)=>{
        if(err){
          throw err
        }
        else{
          updateUser.password = hash
          console.log(updateUser)
          pool.query("UPDATE my_admin SET username= $1, password = $2, email = $3, role= $4, profile_picture = $5 WHERE user_id=$6",
              [updateUser.username, updateUser.password, updateUser.email, updateUser.role, updateUser.profile_picture, id])
            .then(data=>{
              res.status(200).json({status:"User has been updated"})
              pool.query("COMMIT TRANSACTION")
            })
            .catch(err=>{
              res.status(400).json(err)
            })
        }
      })
    })
  }
})

router.delete('/deleteAdmin/:id', (req, res)=>{
  const id = req.params.id

  if(pool.query('select * from my_admin where user_id=$1', [id]) !=""){
    pool.query("delete from my_admin where user_id = $1", [id])
    .then(data=>{
      res.status(200).json({status:"User has been deleted"})
      pool.query("COMMIT TRANSACTION")
    })
    .catch(err=>{
      res.status(400).json(err)
    })
  }else{
    res.status(400).json("No user with this id is found")
  }
})

module.exports = router

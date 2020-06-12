const Pool = require('pg').Pool
const multer = require('multer')
const router = require('express').Router()
const bcryt = require('bcryptjs')

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "admin",
  port: 5432
})

var today = new Date()

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'blog_uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname+'-'+ Date.now()+'.png')
  }
})

var upload = multer({ storage: storage })

router.get('/getBlogs', (req, res)=>{
  const query = "SELECT * FROM blog"

  pool.query(query)
    .then((data)=>{
      res.status(200).json(data.rows)
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})

router.get('/myBlog/:id', (req, res)=>{
  const id = req.params.id
  console.log(id)
  const query = "SELECT * FROM blog WHERE blog_id = $1"

  pool.query(query, [id])
    .then((data)=>{
      res.status(200).json(data.rows)
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})

router.post('/addBlog', upload.single('picture'),(req, res)=>{

  var dateTime = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+"  "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()

    let blogData = {
      blog_name: req.body.blog_name,
      blog_body: req.body.blog_body,
      by: req.body.by,
      picture: req.file.filename,
    }

    if( blogData.blog_name!= '' && blogData.blog_body!= '' && blogData.by!= '' && blogData.picture!= '' ){
      const query = "INSERT INTO blog(blog_name, blog_body, by, picture) VALUES($1, $2, $3, $4)"
      pool.query(query, [blogData.blog_name, blogData.blog_body, blogData.by, blogData.picture])
        .then((data)=>{
          res.status(200).json({status:"Blog has been added"})
        })
        .catch(err=>{
          res.status(400).json(err)
        })
    }
  else{
    res.status(400).json('Please Enter all the details')
  }

})

router.put('/updateBlog/:id', upload.single('picture'),(req, res)=>{

  const id = req.params.id

  const updateBlog = {
    blog_name: req.body.blog_name,
    blog_body: req.body.blog_body,
    by: req.body.by,
    picture: req.file.filename,
  }

  if(updateBlog.blog_name != '' && updateBlog.blog_body != '' && updateBlog.by != '' && updateBlog.picture != ''){
          pool.query("UPDATE blog SET blog_name = $1, blog_body = $2, by = $3, picture = $4 WHERE blog_id=$5",
              [updateBlog.blog_name, updateBlog.blog_body, updateBlog.by, updateBlog.picture, id])
            .then(data=>{
              res.status(200).json({status:"Blog has been updated"})
            })
            .catch(err=>{
              res.status(400).json(err)
            })
        }else{
          res.status(400).json({status:"Please enter all the details"})
        }
})

router.delete('/deleteBLog/:id', (req, res)=>{
  const id = req.params.id

  if(pool.query('select * from blog where blog_id=$1', [id]) !=""){
    pool.query("delete from blog where blog_id = $1", [id])
    .then(data=>{
      res.status(200).json({status:"Blog has been deleted"})
    })
    .catch(err=>{
      res.status(400).json(err)
    })
  }else{
    res.status(400).json("No Blog with this id is found")
  }
})

module.exports = router

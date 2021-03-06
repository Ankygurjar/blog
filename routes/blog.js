const Pool = require('pg').Pool
const multer = require('multer')
const router = require('express').Router()
const bcryt = require('bcryptjs')
const path = require('path');

const pool = new Pool({
  user: "ankit",
  host: "blog-1.cthkqb1wuvvt.us-east-2.rds.amazonaws.com",
  database: "blogging",
  password: "Mukeshmaa",
  port: 5432
})

var today = new Date()

const imagePath = path.join(__dirname, '/../know/build/blog_uploads');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, imagePath)
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname+'-'+ Date.now()+'.png')
  }
})

var upload = multer({ storage: storage })

router.get('/getBlogs', (req, res)=>{
  let query = 'select * from blog'
  pool.query(query)
    .then(data=>{
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

router.get('/myAdminBlog/:id', (req, res)=>{
  const id = req.params.id
  const query = "SELECT * FROM blog WHERE user_id = $1"

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
      blog_body: JSON.parse(req.body.blog_body),
      by: req.body.by,
      picture: req.file.filename,
      category: req.body.category,
      user_id: parseInt(req.body.user_id)
    }
    console.log(blogData)
    if( blogData.blog_name!= '' && blogData.blog_body!= '' && blogData.by!= '' && blogData.picture!= '' ){

      const query = "insert into blog (blog_name, blog_body, by, picture, category, user_id) VALUES($1, $2, $3, $4, $5, $6)"
      pool.query(query, [blogData.blog_name, blogData.blog_body, blogData.by, blogData.picture, blogData.category, blogData.user_id])
        .then((data)=>{

          res.status(200).json({status:"Blog has been added"})
          pool.query("COMMIT TRANSACTION")
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
  console.log(req.body)
  const id = req.params.id

  const updateBlog = {
    blog_name: req.body.blog_name,
    blog_body: req.body.blog_body,
    by: req.body.by,
    category: req.body.category,
    picture: req.file.filename,
  }
  if(updateBlog.blog_name != '' && updateBlog.blog_body != '' && updateBlog.by != '' && updateBlog.picture != ''){
    console.log(updateBlog)
          pool.query("UPDATE blog SET blog_name = $1, blog_body = $2, by = $3, picture = $4, category = $5 WHERE blog_id=$6",
              [updateBlog.blog_name, updateBlog.blog_body, updateBlog.by, updateBlog.picture, updateBlog.category, id])
            .then(data=>{
              res.status(200).json({status:"Blog has been updated"})
              pool.query("COMMIT TRANSACTION")
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
      pool.query("COMMIT TRANSACTION")
    })
    .catch(err=>{
      res.status(400).json(err)
    })
  }else{
    res.status(400).json("No Blog with this id is found")
  }
})

router.get('/getComments', (req, res)=>{
  const query = "select * from blogcomment"
  pool.query(query, (err, data)=>{
    if(err){
      res.status(400).json(err)
    }
    else{
      res.status(200).json(data.rows)
    }
  })
})

router.post('/addComment', (req, res)=>{
  console.log(req.body)
  const comment = {
    comment_body : req.body.comment_body,
    commentor : req.body.commentor,
    comment_email : req.body.comment_email,
    blog_id : req.body.blog_id
  }
  if(comment.comment_body != '' && comment.commentor != '' && comment.comment_email!= '' && comment.blog_id != ''){
    console.log(comment)
    const query = 'INSERT INTO blogcomment(comment_body, commentor, commentor_email, blog_id) VALUES($1, $2, $3, $4)'
    pool.query(query, [comment.comment_body, comment.commentor, comment.comment_email, comment.blog_id])
      .then(data=>{
        res.status(200).json({status: 'Comment saved '})
        pool.query("COMMIT TRANSACTION")
      })
      .catch(err=>{
        res.status(400).json(err)
      })
  }else{
    res.status(400).json({status: 'Please enter all the deatils'})
  }
})

router.get('/getComments/:blogId', (req, res)=>{
  const blogId = req.params.blogId

  const query = 'SELECT * FROM blogcomment WHERE blog_id = $1'
  pool.query(query, [blogId])
    .then(data=>{
      res.status(200).json(data.rows)
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})

router.delete('/deleteComment/:blogId', (req, res)=>{
  const blogId = req.params.blogId

  const query = "DELETE FROM blogcomment WHERE comment_id = $1"
  pool.query(query, [blogId])
    .then((data)=>{
      res.status(200).json({status:"Comment with id : "+blogId+" is deleted"})
      pool.query("COMMIT TRANSACTION")
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})

router.post('/getData', (req, res)=>{
  console.log(req.body)
  let search = {
    data: req.body.data
  }

  if(search.data !== ''){
    const query='SELECT * FROM blog WHERE blog_body LIKE $1'
    pool.query(query, ['%'+search.data+'%'])
      .then((blogsData)=>{
        res.status(200).json(blogsData.rows)
        
      })
      .catch((err)=>{
        res.status(400).json(err)
      })
  }else{
    res.status(400).json({status:"Enter a query"})
  }

})


module.exports = router

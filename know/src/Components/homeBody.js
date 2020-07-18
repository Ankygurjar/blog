import React, {Component} from 'react'
import axios from 'axios'
import '../App.css'
import parse from 'html-react-parser'
import {Link} from 'react-router-dom'

export default class HomeBody extends Component{

  constructor(){
    super()
    this.state = {
      blogs:[],
      comments: [],
      commentor:'',
      comment_body:'',
      comment_email: '',
    }

    this.comment = this.comment.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount(){
    axios.get("http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/getBlogs")
      .then((res)=>{
        this.setState({
          blogs: res.data
        })
      })
      .catch(err=>{
        console.log(err)
      })

  }

  onChange(e){
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  comment(id){

    const comment = {
      comment_body: this.state.comment_body,
      commentor: this.state.commentor,
      comment_email: this.state.comment_email,
      blog_id: id.toString()
    }

    axios.post('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/addComment', comment)
      .then((res)=>{
        alert("Comment has been saved")
        window.location.reload()
      })
      .catch(err=>{
        console.log(err)
        console.log(comment)
      })

  }


  render(){
    return(
      <div>
        {this.state.blogs.map((item, index)=>{

          let subBody = item.blog_body.slice(0,200)

          return(
            <div className="container" key={index}>
            <div className="blog">
              <img className="blog-image" src={`/blog_uploads/${item.picture}`} alt="Blog Shadow"/>

              <div className="blog-detail">
              <h3><Link className="blog-link" to={`blog/${item.blog_id}`}>{item.blog_name}</Link></h3>
              <p>By : <b>{item.by}</b></p>
              <p>Category : <b>{item.category}</b></p>


              {parse(subBody)}
              <Link to={`blog/${item.blog_id}`}>Read More...</Link>

              </div>
              </div>
              </div>
              )

              })}

            <hr/>
            </div>
    )
  }
}

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
    axios.get("http://localhost:6700/blog/getBlogs")
      .then((res)=>{
        this.setState({
          blogs: res.data
        })
      })
      .catch(err=>{
        console.log(err)
      })

      axios.get("http://localhost:6700/blog/getComments")
        .then((res)=>{
          this.setState({
            comments: res.data
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

    axios.post('http://localhost:6700/blog/addComment', comment)
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
      <hr/>
        {this.state.blogs.map((item, index)=>{
          return(
            <div className="container" key={index}>
              <h3><Link to={`blog/${item.blog_id}`}>{item.blog_name}</Link></h3>
              <h4>{item.created_at}</h4>
              <h4>Category : {item.category}</h4>
              <img src={`../../../${item.picture}`} alt="Blog Shadow"/>

              {parse(item.blog_body)}
              <h3>Comments</h3>

              {this.state.comments.map((comment, i)=>{
                if(item.blog_id === parseInt(comment.blog_id)){
                  return(

                    <div className="comments" key={i}>

                    <p>{comment.commentor}</p>
                    <p>{comment.created_at}</p>
                    <p>{comment.comment_body}</p>

                    </div>

                  )
                }
              })}
              <h4>Add Comment</h4>

              <form className="comments" onSubmit={(e)=>{e.preventDefault(); this.comment(item.blog_id)}}>
                <input type="text" className="comment-body" name="comment_body" onChange={this.onChange} placeholder="enter your comment..." required/>
                <input type="text" className="commentor" name="commentor" onChange={this.onChange} placeholder="enter your name" required/>
                <input type="text" className="comment-email" name="comment_email" onChange={this.onChange} placeholder="enter your email..." />
                <input type="submit"  className="addComment" />
              </form>

              <hr/>
            </div>
          )

        })}

        <hr/>
      </div>
    )
  }
}

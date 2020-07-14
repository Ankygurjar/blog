import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Header from './Header2'

export default class ListComments extends Component{

  constructor(){
    super()

    this.state = {
      comments:[]
    }

    this.deleteComment = this.deleteComment.bind(this)

  }

  componentDidMount(){
    axios.get('http://localhost:6700/blog/getComments')
      .then((res)=>{
        this.setState({
          comments: res.data
        })
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  deleteComment(id){
    const confirmDelete = window.confirm("Are your sure to delete this comment?")
    if(confirmDelete===true){
      axios.delete('http://localhost:6700/blog/deleteComment/'+id)
        .then((res)=>{
          alert("Comment has been deleted")
          window.location.reload()
        })
      }
    }

  render(){
    return(
      <div>
      <Header/>
      <div className="container">
      <h3>List of all the blogs</h3>

      <table border="1">
      <thead>
        <tr>
          <th>Comment</th>
          <th>By</th>
          <th>Email of the Commentator</th>
          <th>On</th>
        </tr>
      </thead>
        {this.state.comments.map((comment, index)=>{
          return(
            <tbody key={index}>
              <tr>
                <td><Link to={`/blog/${comment.blog_id}`}>{comment.comment_body}</Link></td>
                <td>{comment.commentor}</td>
                <td>{comment.commentor_email}</td>
                <td>{comment.created_at}</td>
                <button onClick={(e)=>{e.preventDefault();this.deleteComment(comment.comment_id)}}>Delete This comment</button>
              </tr>
            </tbody>
          )
        })}
      </table>

      </div>
      </div>
    )
  }
}

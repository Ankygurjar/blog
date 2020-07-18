import React, {Component} from 'react'
import axios from 'axios'
import parse from 'html-react-parser'
import jwt_decode from 'jwt-decode'
import Header from './Header2'

export default class Blog extends Component{

  constructor(){
    super()

    this.state= {
      blog_id:'',
      blog_name:'',
      blog_body:'',
      by:'',
      picture:'',
      category:'',
      created_at:'',
      user_id:'',
      comments: [],
      commentor:'',
      comment_body:'',
      comment_email: '',
      ownerToken:sessionStorage.token,
      ownerId:'',
      ownerPrivilage: false
    }

    this.comment = this.comment.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e){
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  comment(){

    const comment = {
      comment_body: this.state.comment_body,
      commentor: this.state.commentor,
      comment_email: this.state.comment_email,
      blog_id: this.props.match.params.id
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

  componentDidMount(){
    if(sessionStorage.token){
    const decode = jwt_decode(this.state.ownerToken)
    let UserStatus = "owner"   
    axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/myAdmin/'+decode._id)
      .then((res)=>{
	console.log(res.data[0].role)
	if(res.data[0].role===UserStatus){
          this.setState({
            ownerPrivilage:true
          })
	}
      })
	.catch(err=>{
	console.log(err)
})
    }
    axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/myBlog/'+this.props.match.params.id)
      .then(res=>{
        this.setState({
          blog_id: res.data[0].blog_id,
          blog_name: res.data[0].blog_name,
          blog_body: res.data[0].blog_body,
          by: res.data[0].by,
          picture: res.data[0].picture,
          category: res.data[0].category,
          created_at: res.data[0].created_at,
          user_id: res.data[0].user_id,
        })
      })
      .catch(err=>{
        console.log(err)
      })

    axios.get("http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/getComments/"+ this.props.match.params.id)
      .then((res)=>{
        this.setState({
          comments:res.data
        })
      })
      .catch(err=>{
        console.log(err)
      })
  }

  deleteBlog(id){
    const confirm = window.confirm("Are your sure to delete this blog?")
    if(confirm===true){
    axios.delete("http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/deleteBLog/"+id)
      .then((res)=>{
        alert("Blog deleted")
        this.props.history.push('/')
      })
      .catch(err=>{
        console.log(err)
      })
    }

  }



  ownerActions(){
    if(this.state.ownerPrivilage===true){
      return(
        <div>
          <button className="dlt-btn" onClick={(e)=>{e.preventDefault();this.deleteBlog(this.state.blog_id)}}>DELETE this post of the User</button>
        </div>
      )
    }
  }

  deleteComment(id){
    console.log(id)
    const confirmDelete = window.confirm("Are you sure to delete the comment?")
    if(confirmDelete === true){
      axios.delete('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/deleteComment/'+id)
        .then((res)=>{
          alert("Comment has been deleted")
          window.location.reload()
        })
        .catch(err=>{
          console.log(err)
        })
      }
    }

  ownerActions2(id){
    if(this.state.ownerPrivilage===true){
      return(
        <div>
          <button className="dlt-btn" onClick={(e)=>{e.preventDefault();this.deleteComment(id)}}>DELETE this comment of the User</button>
        </div>
      )
    }
  }

  render(){
    let date = this.state.created_at
    date = new Date(date).toString()
    return(
      <div>
      <Header/>
      <div className="container">
        <hr/>

          <div className="single-blog">

            <img className="single-blog-image" src={`/blog_uploads/${this.state.picture}`} alt="blog-shadow" />
            <h3>{this.state.blog_name}</h3>
            <p>By : <b>{this.state.by}</b></p>
            <p>On : <b>{date}</b></p>
            <p>Category : <b>{this.state.category}</b></p>

            {parse(this.state.blog_body)}

          </div>

          <h3>Comments | {this.state.comments.length}</h3>

          {this.state.comments.map((comment, i)=>{
            let date = comment.created_at
            date = new Date(date).toString()
            return(
              <div key={i} className="comment">
                <p>{comment.comment_body}</p>
                <p>by : <b>{comment.commentor}</b></p>
                <p>On : {date}</p>
                {this.ownerActions2(comment.comment_id)}
              </div>
            )
          })}

          <div className="comment-form">
          <h4>Add Comment</h4>
          <form className="comment" onSubmit={(e)=>{e.preventDefault(); this.comment(this.props.match.params.id)}}>
            <input type="text" className="comment-detail" name="comment_body" onChange={this.onChange} placeholder="enter your comment..." required/><br/>
            <input type="text" className="comment-detail" name="commentor" onChange={this.onChange} placeholder="enter your name" required/><br/>
            <input type="text" className="comment-detail" name="comment_email" onChange={this.onChange} placeholder="enter your email..." /><br/>
            <input type="submit"  className="cmt-btn" />
          </form>
          </div>
        <hr/>

        {this.ownerActions()}

      </div>
      </div>
    )
  }
}

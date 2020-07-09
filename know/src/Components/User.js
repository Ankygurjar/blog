import React, {Component} from 'react'
import axios from 'axios'
import parse from 'html-react-parser'
import jwt_decode from 'jwt-decode'
import {Link} from 'react-router-dom'

export default class User extends Component{

  constructor(){
    super()
    this.state = {
      user_token: sessionStorage.token,
      user_id:'',
      email:'',
      name:'',
      username:'',
      profile_picture:'',
      joined_on:'',
      role:'',
      blogs:[]
    }

    this.delete = this.delete.bind(this)
  }

  delete(id){
    console.log(id)

    var c = window.confirm("Pres Yes to delete the post")
    if( c===true ){
      axios.delete('http://localhost:6700/blog/deleteBLog/'+id)
        .then(res=>{
          alert("Blog has been deleted")
          window.location.reload()
        })
        .catch(err=>{
          console.log(err)
        })
    }
  }

  componentDidMount(){
    const decode = jwt_decode(this.state.user_token)
    this.setState({
      user_id:decode._id
    })

    axios.get('http://localhost:6700/admin/myAdmin/5'+this.state.user_id)
      .then((res)=>{
        this.setState({
          email:res.data[0].email,
          name:res.data[0].name,
          profile_picture:res.data[0].profile_picture,
          username:res.data[0].username,
          role:res.data[0].role,
          joined_on:res.data[0].joined_on
        })
      })
      .catch(err=>{
        console.log(err)
      })
      console.log(decode._id)
      axios.get('http://localhost:6700/blog/myAdminBlog/'+decode._id)
        .then(res=>{
          this.setState({
            blogs:res.data
          })
        })
  }

  render(){
    let date = this.state.joined_on
    date = new Date(date).toString()
    return(
      <div className="container">

        <p>Hello <b>{this.state.name}</b> </p>
        <p>Your Email : <b>{this.state.email}</b></p>
        <p>Your Username : <b>{this.state.username}</b></p>
        <p>Your role : <b>{this.state.role}</b></p>
        <p>Joined On : <b>{date}</b></p>
        <img src={this.state.profile_picture}/>
        <h3>You have : {this.state.blogs.length} Blogs</h3>
        <hr/>
        {this.state.blogs.map((blog, index)=>{
          return(

            <div key={index}>
              <h4>{blog.blog_name}</h4>
              <img src={blog.picture} />
              {parse(blog.blog_body)}
              <h4>Category : {blog.category}</h4>
              <h4>{new Date(blog.created_at).toString()}</h4>
              <Link className="update-btn" to={`/update/${blog.blog_id}`}>UPDATE</Link>
              <button className="dlt-btn" onClick={(e)=>{e.preventDefault(); this.delete(blog.blog_id)}}>DELETE</button>
              <hr/>
            </div>

          )
        })}

      </div>
    )
  }
}

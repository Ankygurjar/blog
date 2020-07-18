import React, {Component} from 'react'
import axios from 'axios'
import parse from 'html-react-parser'
import jwt_decode from 'jwt-decode'
import {Link} from 'react-router-dom'
import Header from './Header2'

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
      blogs:[],
      ownerToken:sessionStorage.token,
      ownerId:'',
      ownerPrivilage: false
    }

    this.delete = this.delete.bind(this)
  }

  delete(id){

    var c = window.confirm("Pres Yes to delete the post")
    if( c===true ){
      axios.delete('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/deleteBLog/'+id)
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

    axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/myAdmin/'+decode._id)
      .then((res)=>{
        this.setState({
          email:res.data[0].email,
          name:res.data[0].name,
          profile_picture:res.data[0].profile_picture,
          username:res.data[0].username,
          role:res.data[0].role,
          joined_on:res.data[0].created_at
        })
	console.log(res.data[0])
      })
      .catch(err=>{
        console.log(err)
      })
      axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/myAdminBlog/'+decode._id)
        .then(res=>{
          this.setState({
            blogs:res.data
          })
        })
  }

  deleteUser(e){
    e.preventDefault()
    const decode = jwt_decode(sessionStorage.getItem('token'))
    const confirmDelete = window.confirm("You are sure to delete this account? The ACTION CANNOT BE UNDONE!")
    if(confirmDelete === true){
      axios.delete('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/deleteAdmin/'+ decode._id)
        .then((res)=>{
          alert('User has been deleted')
          sessionStorage.removeItem('token')
          window.location.href = '/'
        })
        .catch(err=>{
          console.log(err)
        })
    }
  }


  ownerActions(){
    if(this.state.role === "owner"){
      console.log("Hello")
      return(
        <div className="ownerActions">
          <p><b>Owner's Profile</b></p>
          <Link className="searchBtn owner" to='/users'>See All the Users</Link>
          <Link className="searchBtn owner" to='/blogs'>See All the blog Posts</Link>
          <Link className="searchBtn owner" to='/comments'>See all the comments</Link>
        </div>
      )
    }
  }

  render(){
	console.log(this.state.joined_on)

    return(
      <div>
      <Header />
      <div className="container">
      {
        this.ownerActions()
      }
      <div className="user">
        <div className="userDetails">
        <p>Hello <b>{this.state.name}</b> </p>
        <p>Your Email : <b>{this.state.email}</b></p>
        <p>Your Username : <b>{this.state.username}</b></p>
        <p>Your role : <b>{this.state.role}</b></p>

        <p>Joined On : <b>{this.state.joined_on}</b></p>
      </div>
        <img alt="Shadow" className="blog-image" src={`/client_uploads/${this.state.profile_picture}`}/>
      </div>
  	<br/><br/>
        <Link className="update-btn" to={`/updateUser/${this.state.user_id}`}>Update</Link>

        <button className="dlt-btn" onClick={this.deleteUser}>Delete</button>

        <h3>You have : {this.state.blogs.length} Blogs</h3>
        <hr/>
        {this.state.blogs.map((blog, index)=>{
          return(

            <div key={index}>
              <h4><Link to={`blog/${blog.blog_id}`}>{blog.blog_name}</Link></h4>
              <img alt="Shadow" className="blog-image" src={`/blog_uploads/${blog.picture}`} />
              {parse(blog.blog_body)}
              <h4>Category : {blog.category}</h4>
              <h4>{new Date(blog.created_at).toString()}</h4>
              <Link className="update-btn" to={`/update/${blog.blog_id}`}>UPDATE</Link>
              <button className="dlt-btn" onClick={this.deleteUser}>DELETE</button>
              <hr/>

            </div>

          )
        })}

      </div>
      </div>
    )
  }
}

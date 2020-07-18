import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import parse from 'html-react-parser'
import Header from './Header2'

export default class UserForOwner extends Component{

  constructor(){
    super()
    this.state = {
      blogs:[]
    }
  }

  componentDidMount(){
    axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/myAdminBlog/'+this.props.match.params.id)
      .then((res)=>{
        this.setState({
          blogs: res.data
        })
      })
      .catch(err=>{
        console.log(err)
      })
  }
  render(){
    return(
      <div>
      <Header />
      <div className="container">

        <h3>This User has {this.state.blogs.length} Blogs</h3>
        {this.state.blogs.map((item, index)=>{
          return(
            <div className="container" key={index}>
            <div className="blog">
              <h3><Link to={`/userForOwner/blog/${item.blog_id}`}>{item.blog_name}</Link></h3>
              <h4>On : {item.created_at}</h4>
              <p>By : <b>{item.by}</b></p>
              <p>Category : <b>{item.category}</b></p>
              {console.log(__dirname+item.picture)}
              <img className="blog-image" src={`/blog_uploads/${item.picture}`} alt="Blog Shadow"/>

              {parse(item.blog_body)}


              <hr/>
              </div>
            </div>
          )

        })}

      </div>
      </div>
    )
  }
}

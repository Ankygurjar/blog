import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Header from './Header2'

export default class ListBlogs extends Component{

  constructor(){
    super()

    this.state = {
      blogs:[]
    }
  }

  componentDidMount(){
    axios.get('http://localhost:6700/blog/getBlogs')
      .then((res)=>{
        this.setState({
          blogs: res.data
        })
        console.log(this.state.blogs)
      })
      .catch(err=>{
        console.log(err)
      })
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
            <th>Blog Name</th>
            <th>By</th>
            <th>Category</th>
            <th>Created On</th>
          </tr>
        </thead>
          {this.state.blogs.map((blog, index)=>{
            return(
              <tbody key={index}>
                <tr>
                  <td><Link to={`/blog/${blog.blog_id}`}>{blog.blog_name}</Link></td>
                  <td>{blog.by}</td>
                  <td>{blog.category}</td>
                  <td>{blog.created_at}</td>
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

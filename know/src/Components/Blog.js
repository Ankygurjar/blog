import React, {Component} from 'react'
import axios from 'axios'
import parse from 'html-react-parser'

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
      user_id:''
    }
  }

  componentDidMount(){
    axios.get('http://localhost:6700/blog/myBlog/'+this.props.match.params.id)
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
  }

  render(){
    let date = this.state.created_at
    date = new Date(date).toString()
    return(
      <div className="container">
        <hr/>

          <div className="blog-detail">

            <h3>{this.state.blog_name}</h3>
            <h5>By : {this.state.by}</h5>
            <h5>On : {date}</h5>
            <h5>Category : {this.state.category}</h5>
            <img src={this.state.picture} alt="blog-shadow" />
            {parse(this.state.blog_body)}

          </div>

        <hr/>
      </div>
    )
  }
}

import React, {Component} from 'react'
import axios from 'axios'
import parse from 'html-react-parser'
import {Link} from 'react-router-dom'
import Header from './Header2'

export default class Search extends Component{

  constructor(){
    super()

    this.state = {
      data:[]
    }
  }

  componentDidMount(){
    let data = this.props.location.search
    data = data.slice(1, data.length)
    console.log(data)
    axios.post('http://localhost:6700/blog/getData/', {data})
      .then((res)=>{
        this.setState({
          data: res.data
        })
        console.log(res.data)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  searchResult(){
    if(this.state.data.length === 0){
      return(
      <div>
        <h3>Sorry nothing matches your query......</h3>
      </div>
    )
    }
  }

  render(){
    return(
      <div>
      <Header/>
      <div className="container">
      {
        this.searchResult()
      }
      {this.state.data.map((item, index)=>{
        return(
          <div className="container" key={index}>
          <div className="blog">
            <h3><Link to={`blog/${item.blog_id}`}>{item.blog_name}</Link></h3>
            <h4>On : {item.created_at}</h4>
            <p>By : <b>{item.by}</b></p>
            <p>Category : <b>{item.category}</b></p>
            <img className="blog-image" src={`/blog_uploads/${item.picture}`} alt="Blog Shadow"/>

            {parse(item.blog_body)}


            <hr/>
            </div>
          </div>
        )

      })}

      <hr/>
      </div>
      </div>
    )
  }
}

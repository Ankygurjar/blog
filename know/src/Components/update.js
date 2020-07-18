import React, {Component} from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Header from './Header2'

import { Editor } from '@tinymce/tinymce-react';

export default class Update extends Component{

  constructor(){
    super()

    this.state = {
      blog_id:'',
      by:'',
      blog_body:'',
      blog_name:'',
      category:'',
      picture:''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.FileChange = this.FileChange.bind(this)
  }

  handleEditorChange = (content, editor) => {
     this.setState({
       blog_body: content
     })

   }

   FileChange(e){
     e.preventDefault()
     this.setState({
       picture: e.target.files[0]
     })
   }

   onChange(e){
      e.preventDefault()
      this.setState({
        [e.target.name]: e.target.value
      })
   }

   onSubmit(e){
     console.log(this.state.blog_id)
     e.preventDefault()
     const blog = new FormData()

     blog.append('blog_name', this.state.blog_name)
     blog.append('blog_body', this.state.blog_body)
     blog.append('picture', this.state.picture)
     blog.append('by', this.state.by)
     blog.append('category', this.state.category)


       if(blog.getAll('category')[0] === "no"){
         alert("You cannot select NONE as a category for the blog")
       }else{

         axios.put('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/updateBlog/'+this.state.blog_id, blog)
           .then((res)=>{
             alert('Blog Updated')
             this.props.history.push('/user')
           })
           .catch(err=>{
             alert(err)
           })

       }
     }


  componentDidMount(){

    let token = sessionStorage.token
    console.log(token)
    let decode = jwt_decode(token)
    this.setState({
      by: decode.name
    })
    axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/blog/myBlog/'+ this.props.match.params.id)
      .then(res=>{
        this.setState({
          blog_id: res.data[0].blog_id,
          blog_name:res.data[0].blog_name,
          blog_body:res.data[0].blog_body,
          category: res.data[0].category
        })
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
      <form className="add-blog" onSubmit={this.onSubmit}>

        <div className="blog-data">
          <h3>Blog Name</h3>
          <input value={this.state.blog_name} type="text" name="blog_name" onChange={this.onChange} className="content-name" placeholder="enter the name of your blog...."/>
        </div>

        <div className="blog-data">
          <h3>Blog Body</h3>

          <Editor
          apiKey='wynl3oc2lg37bydl9t0r8drymh1zf1dod2xuyerxq0xgqns9'
       initialValue={this.state.blog_body}
       init={{
         height: 500,
         menubar: false,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor',
           'searchreplace visualblocks code fullscreen',
           'insertdatetime media table paste code help wordcount'
         ],
         toolbar:
           'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
       }}
       onEditorChange={this.handleEditorChange}
     />

        </div>

        <div className="blog-data">
          <h3>Category</h3>
          <select name="category" value={this.state.category} className="category" onChange={this.onChange}>
            <option value="no">--NONE--</option>
            <option value="sports">Sports</option>
            <option value="fashion">Fashion</option>
            <option value="arts">Arts</option>
            <option value="music">Music</option>
            <option value="photography">Photography</option>
            <option value="news">News</option>
            <option value="technology">Technology</option>
            <option value="essentials">Essentials</option>
            <option value="food">Food</option>
            <option value="work">Work</option>
            <option value="trading">trading</option>
          </select>
        </div>

        <div className="blog-data">
          <h3>Image for the blog</h3>
          <input type="file" onChange={this.FileChange} name="picture" className="blog-name" />
        </div>

        <input type="submit" value="Submit" className="submit-blog"/>

      </form>

      </div>
	</div>
    )
  }
}

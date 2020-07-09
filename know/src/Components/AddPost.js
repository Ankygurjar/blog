import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

import { Editor } from '@tinymce/tinymce-react';


export default class AddPost extends Component{

    constructor(){
      super()

      this.state={
        blog_name:'',
        blog_body:'',
        by:'',
        picture:'',
        category:'',
        user_id:''
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
     e.preventDefault()
     const blog = new FormData()

     blog.append('blog_name', this.state.blog_name)
     blog.append('blog_body', JSON.stringify(this.state.blog_body))
     blog.append('by', this.state.by)
     blog.append('picture', this.state.picture)
     blog.append('category', this.state.category)
     blog.append('user_id', this.state.user_id)

     if(blog.getAll('blog_name')[0]!=='' && blog.getAll('blog_body')[0] !=='' && blog.getAll('picture')[0] !=='' && blog.getAll('category')[0] !==''){

       if(blog.getAll('category')[0] === "no"){
         alert("You cannot select NONE as a category for the blog")
       }else{

         axios.post('http://localhost:6700/blog/addBlog', blog)
           .then((res)=>{
             alert('Blog Added')
             this.props.history.push('/')
           })
           .catch(err=>{
             alert(err)
           })

       }
     }
     else{
       alert("Please enter all the data")
     }

   }

   componentDidMount(){
     let token = sessionStorage.token
     console.log(token)
     let decode = jwt_decode(token)
     this.setState({
       by: decode.name,
       user_id: decode._id
     })
   }

  render(){

    return (
      <div className="container">
        <h3>Hello from Editor</h3>

        <form className="add-blog" onSubmit={this.onSubmit}>

          <div className="blog-data">
            <h3>Blog Name</h3>
            <input require="true" type="text" name="blog_name" onChange={this.onChange} className="content-name" placeholder="enter the name of your blog...."/>
          </div>

          <div className="blog-data">
            <h3>Blog Body</h3>

            <Editor
            apiKey='wynl3oc2lg37bydl9t0r8drymh1zf1dod2xuyerxq0xgqns9'
         initialValue=" "
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
            <select name="category" className="category" onChange={this.onChange}>
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
            <input require="true" type="file" onChange={this.FileChange} name="picture" className="blog-name" />
          </div>

          <input type="submit" value="Submit" className="submit-blog"/>

        </form>


      </div>
    );
  }
}

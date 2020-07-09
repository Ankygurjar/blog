import React, {Component} from 'react'
import axios from 'axios'

export default class Register extends Component{

  constructor(){
    super()
    this.state={
      name: '',
      username: '',
      password: '',
      password2: '',
      email: '',
      role: '',
      files: null
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.FileChange = this.FileChange.bind(this)

  }

  onChange(e){
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  FileChange(e){
    e.preventDefault()
    this.setState({
      files: e.target.files[0]
    })
  }

  onSubmit(e){
    e.preventDefault()
    let userStatus = true
    const user = new FormData()
    user.append('name', this.state.name)
    user.append('username', this.state.username)
    user.append('password', this.state.password)
    user.append('password2', this.state.password2)
    user.append('email', this.state.email)
    user.append('role', this.state.role)
    user.append('picture', this.state.files, this.state.files.name)
    console.log(user)

    if(user.getAll('name')!=='' && user.getAll('username') !=='' && user.getAll('password') !=='' && user.getAll('password2') !=='' && user.getAll('email') !=='' && user.getAll('email') !=='' && user.getAll('picture') !==''){

      if(user.getAll('password')[0]===user.getAll('password2')[0]){
        let username = user.getAll('username')[0]

          for(let i=0;i<username.length;i++){
            if(username[i] === ' '){
              alert("You cannot use spaces in your username")
              userStatus = false
            }
            }
            if(userStatus === true){
              axios.post('http://localhost:6700/admin/addAdmin', user)
                .then((res)=>{
                  alert("Registered")
                  this.props.history.push('/login')
                })
                .catch(err=>{
                  alert(err)
                })
            }
          }
          else{
            alert("Passwords are not same")
            window.location.reload()
          }
      }
      else{
        alert("Please enter all the details")
      }

    }

  render(){
    return(
      <div className="container">

        <form className="register-form" onSubmit={this.onSubmit}>

          <h3>Register</h3>

          <div className="register-field">

            <input type="text" onChange={this.onChange} className="input-field" name="name" required placeholder="Enter your name"/><br/>
            <input type="text" onChange={this.onChange} className="input-field" name="username" required placeholder="Enter your username"/><br/>
            <input type="password" onChange={this.onChange} className="input-field" name="password" required placeholder="Enter your password"/><br/>
            <input type="password" onChange={this.onChange} className="input-field" name="password2" required placeholder="Confirm your password"/><br/>
            <input type="email" onChange={this.onChange} className="input-field" name="email" required placeholder="Enter your email"/><br/>
            <input type="text" onChange={this.onChange} className="input-field" name="role" required placeholder="Enter the role"/><br/>
            <input type="file" onChange={this.FileChange} className="input-field" name="profile_picture"/><br/>
            <input type="submit" value="Submit" />

          </div>

        </form>

      </div>
    )
  }
}

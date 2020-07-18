import React, {Component} from 'react'
import axios from 'axios'
import Header from './Header2'
import { faUser, faKey, faEnvelopeOpen, faQuestionCircle, faImage, faRegistered} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    console.log(this.state.role)
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
              axios.post('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/addAdmin', user)
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
      <div>
      <script src="https://kit.fontawesome.com/a076d05399.js"></script>
      <Header/>
      <div className="register-form-background">
      <div className="container">

        <form className="register-form" onSubmit={this.onSubmit}>

          <h3><FontAwesomeIcon style={{fontSize:"30px"}} icon={faRegistered} />Register</h3>
          <hr/>
          <div className="register-field">

            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faUser} /><input type="text" onChange={this.onChange} className="input-field" name="name" required placeholder="Enter your name"/><br/>
            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faUser} /><input type="text" onChange={this.onChange} className="input-field" name="username" required placeholder="Enter your username"/><br/>
            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faKey} /><input type="password" onChange={this.onChange} className="input-field" name="password" required placeholder="Enter your password"/><br/>
            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faKey} /><input type="password" onChange={this.onChange} className="input-field" name="password2" required placeholder="Confirm your password"/><br/>
            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faEnvelopeOpen} /><input type="email" onChange={this.onChange} className="input-field" name="email" required placeholder="Enter your email"/><br/>

            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faQuestionCircle} /><select onChange={this.onChange} className="input-field" name="role" required>
	      <option value="visitor">--None--</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>

            <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faImage} /><input type="file" onChange={this.FileChange} className="input-field" name="profile_picture"/><br/>
            <input type="submit" className="registerButton" value="Submit" />

          </div>

        </form>
        </div>
      </div>
      </div>
    )
  }
}

import React, {Component} from 'react'
import axios from 'axios'
import Header from './Header2'

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
      files: null,
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.FileChange = this.FileChange.bind(this)

  }

  onChange(e){
    e.preventDefault()
    this.setState({
      role:e.target.value
    })
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this.state.name)
  }

  FileChange(e){
    e.preventDefault()
    this.setState({
      files: e.target.files[0]
    })
  }

  componentDidMount(){
    axios.get('http://localhost:6700/admin/myAdmin/'+ this.props.match.params.id)
      .then((res)=>{
        this.setState({
          name:res.data[0].name,
          username: res.data[0].username,
          password:res.data[0].password,
          email:res.data[0].email,
          role:res.data[0].role,
          files:res.data[0].profile_picture
        })
        console.log(this.state.updateUserPicture)
      })
      .catch((err)=>{
        console.log(err)
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
    user.append('profile_picture', this.state.files, this.state.files.name)
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
              axios.put('http://localhost:6700/admin/updateAdmin/'+ this.props.match.params.id, user)
                .then((res)=>{
                  alert("updated")
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
      <Header/>
      <div className="container">

        <form className="register-form" onSubmit={this.onSubmit}>

          <h3>Update</h3>

          <div className="register-field">

            <input type="text" onChange={this.onChange} className="input-field" value={this.state.name} name="name" /><br/>
            <input type="text" onChange={this.onChange} className="input-field" value={this.state.username} name="username" required /><br/>
            <input type="password" onChange={this.onChange} className="input-field" value={this.state.password} name="password" required /><br/>
            <input type="password" onChange={this.onChange} className="input-field" name="password2" required /><br/>
            <input type="email" onChange={this.onChange} className="input-field" value={this.state.email} name="email" required /><br/>

            <select onChange={this.onChange} className="input-field" placeholder={this.state.role} name="role" required>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>

            <input type="file" onChange={this.FileChange}  className="input-field" name="profile_picture"/><br/>
            <input type="submit" className="registerButton" value="Submit" />

          </div>

        </form>

      </div>
      </div>
    )
  }
}

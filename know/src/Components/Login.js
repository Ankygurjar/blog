import React, {Component} from 'react'
import axios from 'axios'

export default class Login extends Component{

  constructor(){
    super()

    this.state={
      email: '',
      password:''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  onChange(e){
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit(e){
    e.preventDefault()

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post('http://localhost:6700/admin/login', user)
      .then((res)=>{
        console.log(res.data)
        sessionStorage.setItem('token', res.data.token)

        this.props.history.push('/')
        window.location.reload()
      })
      .catch(err=>{
        alert('Email or password is not correct')
        window.location.reload()
      })
  }

  render(){
    return(
      <div>

        <form className="register-form" onSubmit={this.onSubmit}>
        <h3>Login</h3>
        <input type="email" onChange={this.onChange} className="input-field" name="email" required placeholder="Enter your Email"/><br/>
        <input type="password" onChange={this.onChange} className="input-field" name="password" required placeholder="Enter your password"/><br/>
        <input type="submit" value="Submit" />

        </form>

      </div>
    )
  }
}

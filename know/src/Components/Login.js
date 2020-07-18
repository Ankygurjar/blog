import React, {Component} from 'react'
import axios from 'axios'
import Header from './Header2'
import { faEnvelopeOpen, faKey, faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

    axios.post('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/login', user)
      .then((res)=>{
        console.log(res.data)
        sessionStorage.setItem('token', res.data.token)

        this.props.history.push('/user')
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
      <Header/>
      <div className="register-form-background">
        <div className="container">
        <form className="register-form" onSubmit={this.onSubmit}>
        <h3><FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faSignInAlt} />Login</h3>
        <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faEnvelopeOpen} /><input type="email" onChange={this.onChange} className="input-field" name="email" required placeholder="Enter your Email"/><br/>
        <FontAwesomeIcon style={{fontSize:"30px",paddingTop:"0px"}} icon={faKey} /><input type="password" onChange={this.onChange} className="input-field" name="password" required placeholder="Enter your password"/><br/>
        <input type="submit" className="registerButton" value="Submit" />

        </form>
        </div>
        </div>
      </div>
    )
  }
}

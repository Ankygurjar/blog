import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Logo from '../images/knowit.png'

export default class Header extends Component{

  constructor(){
    super()

    this.onLogout = this.onLogout.bind(this)

  }

  onLogout(){
    sessionStorage.removeItem('token')
    this.props.history.push('/')
  }

  render(){

    const loginLinks = (
      <div>
      <li>
          <Link to='/'>KnowIt</Link>
      </li>
      <li>
        <Link to='/addpost'> Add Post</Link>
      </li>
      <li>
        <Link to='/user'> Me</Link>
      </li>
      <li>
        <button className="sbt-btn" onClick={this.onLogout}>Logout</button>
      </li>
      </div>
    )

    const userLink = (
      <div>
      <li className="nav-item">
          <Link to='/'>Home</Link>
      </li>
      <li>
        <Link to='/register'>Sign Up</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
      </div>
    )
    return(
      <header>

        <div className="container">

        <div className="top-menu">

        <img src={Logo} alt="Logo"/>
          <nav className="top-nav">
            <ul>

              {sessionStorage.token ? loginLinks : userLink}

            </ul>
          </nav>

          <form className="top-search">

            <input type="text" placeholder="enter your query...." name="query" />
            <input type="submit" value="submit" className="submit-btn"/>

          </form>

        </div>
        </div>
      </header>
    )
  }
}

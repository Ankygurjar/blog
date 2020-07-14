import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Logo from '../images/knowit.png'

export default class Header extends Component{

  constructor(){
    super()
    this.state={
      search: ''
    }

    this.onLogout = this.onLogout.bind(this)
    this.onChange = this.onChange.bind(this)

  }

  onLogout(){
    sessionStorage.removeItem('token')
    window.location.href = '/';
  }

  onChange(e){
    e.preventDefault()
    this.setState({
      search: e.target.value
    })
  }

  onSubmit(e){
    e.preventDefault()
    console.log(e)
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
        <button className="searchBtn" onClick={this.onLogout}>Logout</button>
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
      <header className="header-2">
      <script src="https://kit.fontawesome.com/a076d05399.js"></script>
        <div className="container">

        <div className="top-menu">

        <img src={Logo} alt="Logo"/>
          <nav className="top-nav">
            <ul>

              {sessionStorage.token ? loginLinks : userLink}

            </ul>
          </nav>

          <form className="top-search" >

            <input type="text" className="searchBar" value={this.state.search} onChange={this.onChange} placeholder="enter your query...." name="query" />
            <Link className="searchBtn" to={`/search/?${this.state.search}`}>Search</Link>

          </form>

        </div>
        </div>

      </header>
    )
  }
}

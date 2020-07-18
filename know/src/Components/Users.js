import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Header from './Header2'

export default class Users extends Component{

  constructor(){
    super()

    this.state = {
      users:[]
    }

    this.delete = this.delete.bind(this)
  }

  componentDidMount(){
    axios.get('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/getAdmins')
      .then((res)=>{
        this.setState({
          users: res.data
        })
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  delete(id){
    let confirmDelete = window.confirm("You want to delete the current user?")

    if(confirmDelete === true){
      axios.delete('http://ec2-3-17-139-40.us-east-2.compute.amazonaws.com:6700/admin/deleteAdmin/'+id)
        .then((res)=>{
          alert("User Deleted")
          window.location.reload()
        })
        .catch((err)=>{
          console.log(err)
        })
    }

  }

  render(){
    return(
      <div>
      <Header/>
      <div className="container">
        <p>List of All Users</p>

        <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Joined On</th>
          </tr>
        </thead>
          {this.state.users.map((user, index)=>{
            return(
              <tbody key={index}>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.created_at}</td>
                  <td><button className="ownerDelete" onClick={(e)=>{e.preventDefault(); this.delete(user.user_id)}}>Delete</button></td>
                  <td><Link to={`/userForOwner/${user.user_id}`}>Click to see the blogs of this User</Link></td>
                </tr>
              </tbody>
            )
          })}
        </table>

      </div>
      </div>
    )
  }
}

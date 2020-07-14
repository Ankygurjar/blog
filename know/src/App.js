import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Home from './Components/Home'
import Register from './Components/Register'
import Footer from './Components/Footer'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import Blog from './Components/Blog'
import User from './Components/User'
import Update from './Components/update'
import Users from './Components/Users'
import UserForOwner from './Components/userForOwner'
import Search from './Components/search'
import UpdateUser from './Components/UpdateUser'
import ListBlogs from './Components/listOfBlogs'
import ListComments from './Components/listOfComments'

function App() {
  return (
    <Router>
    <div>


        <div>

          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login}/>
          <Route exact path='/addpost' component={AddPost}/>
          <Route exact path={"/blog/:id"} component={Blog} />
          <Route exact path="/user" component={User} />
          <Route exact path={"/update/:id"} component={Update} />
          <Route exact path="/users" component={Users}/>
          <Route exact path={"/userForOwner/:id"} component={UserForOwner} />
          <Route exact path={"/userForOwner/blog/:id"} component={Blog} />
          <Route exact path='/search' component={Search}/>
          <Route exact path={'/search/blog/:id'} component={Blog}/>
          <Route exact path={"/updateUser/:id"} component={UpdateUser} />
          <Route exact path={'/blogs'} component={ListBlogs}/>
          <Route exact path='/comments' component={ListComments}/>

        </div>
        <Footer/>
    </div>
    </Router>
  );
}

export default App;

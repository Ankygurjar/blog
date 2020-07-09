import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Home from './Components/Home'
import Header from './Components/Header'
import Register from './Components/Register'
import Footer from './Components/Footer'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import Blog from './Components/Blog'
import User from './Components/User'
import Update from './Components/update'

function App() {
  return (
    <Router>
    <div>
        <Header />

        <div>

          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login}/>
          <Route exact path='/addpost' component={AddPost}/>
          <Route exact path={"/blog/:id"} component={Blog} />
          <Route exact path="/user" component={User} />
          <Route exact path={"/update/:id"} component={Update} />

        </div>
        <Footer/>
    </div>
    </Router>
  );
}

export default App;

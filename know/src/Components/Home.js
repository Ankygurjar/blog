import React, {Component} from 'react'

import HomeBody from './homeBody'
import Header from './Header'

export default class Home extends Component{

  render(){
    return(
      <div>

      <Header/>
        <HomeBody />

      </div>
    )
  }
}

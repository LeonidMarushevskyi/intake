import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import PersonNewPage from 'PersonNewPage'
import PersonShowPage from 'PersonShowPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/people/new' component={PersonNewPage} />
        <Route path='/people/:id' component={PersonShowPage} />
      </Router>
    )
  }
}

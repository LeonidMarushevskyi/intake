import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import PersonNewPage from 'components/people/PersonNewPage'
import PersonShowPage from 'components/people/PersonShowPage'
import PersonEditPage from 'components/people/PersonEditPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/people/new' component={PersonNewPage} />
        <Route path='/people/:id' component={PersonShowPage} />
        <Route path='/people/:id/edit' component={PersonEditPage} />
      </Router>
    )
  }
}

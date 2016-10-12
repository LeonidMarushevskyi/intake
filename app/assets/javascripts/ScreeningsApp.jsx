import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import ScreeningsIndexPage from 'ScreeningsIndexPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/screenings' component={ScreeningsIndexPage} />
      </Router>
    )
  }
}

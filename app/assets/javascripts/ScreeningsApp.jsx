import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import ScreeningEditPage from 'ScreeningEditPage'
import ScreeningsIndexPage from 'ScreeningsIndexPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/screenings' component={ScreeningsIndexPage} />
        <Route path='/screenings/:id/edit' component={ScreeningEditPage} />
      </Router>
    )
  }
}

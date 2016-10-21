import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import ScreeningEditPage from 'ScreeningEditPage'
import ScreeningShowPage from 'ScreeningShowPage'
import ScreeningsIndexPage from 'ScreeningsIndexPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/screenings' component={ScreeningsIndexPage} />
        <Route path='/screenings/:id' component={ScreeningShowPage} />
        <Route path='/screenings/:id/edit' component={ScreeningEditPage} />
      </Router>
    )
  }
}

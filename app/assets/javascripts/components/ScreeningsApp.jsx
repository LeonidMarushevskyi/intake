import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import ScreeningEditPage from 'components/screenings/ScreeningEditPage'
import ScreeningShowPage from 'components/screenings/ScreeningShowPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/screenings/:id' component={ScreeningShowPage} />
        <Route path='/screenings/:id/edit' component={ScreeningEditPage} />
      </Router>
    )
  }
}

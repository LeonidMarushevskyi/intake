import React from 'react'
import {Router, Route, browserHistory} from 'react-router'
import ReferralsIndexPage from 'ReferralsIndexPage'

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/referrals' component={ReferralsIndexPage} />
      </Router>
    )
  }
}

import React from 'react'
import {createHistory} from 'history'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import App from 'common/App'
import HomePage from 'home/HomePage'
import ScreeningPage from 'screenings/ScreeningPage'
import ScreeningSummaryContainer from 'investigations/ScreeningSummaryContainer'
import InvestigationContactContainer from 'investigations/InvestigationContactContainer'
import {config} from 'common/config'

const historyIntake = useRouterHistory(createHistory)({
  basename: config().base_path,
})

export default (
  <Router history={historyIntake} >
    <Route path='/' component={App}>
      <IndexRoute component={HomePage} />
      <Route path='screenings/:id' component={ScreeningPage}/>
      <Route path='screenings/:id/:mode' component={ScreeningPage} />
      <Route path='investigations/:id' component={ScreeningSummaryContainer} />
      <Route path='investigations/:investigation_id/contacts/new' component={InvestigationContactContainer} />
    </Route>
  </Router>
)

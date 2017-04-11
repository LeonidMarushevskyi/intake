import React from 'react'
import {createHistory} from 'history'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import App from 'components/App'
import HomePage from 'components/HomePage'
import PersonNewPage from 'components/people/PersonNewPage'
import PersonShowPage from 'components/people/PersonShowPage'
import PersonEditPage from 'components/people/PersonEditPage'
import ScreeningEditPage from 'components/screenings/ScreeningEditPage'
import ScreeningShowPage from 'components/screenings/ScreeningShowPage'

const historyIntake = useRouterHistory(createHistory)({
  basename: '/',
})

export default (
  <Router history={historyIntake} >
    <Route path='/' component={App}>
      <IndexRoute component={HomePage} />
      <Route path='people/new' component={PersonNewPage} />
      <Route path='people/:id' component={PersonShowPage} />
      <Route path='people/:id/edit' component={PersonEditPage} />
      <Route path='screenings/:id' component={ScreeningShowPage} />
      <Route path='screenings/:id/edit' component={ScreeningEditPage} />
    </Route>
  </Router>
)

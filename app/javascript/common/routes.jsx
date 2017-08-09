import React from 'react'
import {createHistory} from 'history'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import App from 'common/App'
import HomePage from 'home/HomePage'
import PersonNewPage from 'people/PersonNewPage'
import PersonShowPage from 'people/PersonShowPage'
import PersonEditPage from 'people/PersonEditPage'
import ScreeningPage from 'screenings/ScreeningPage'
import {config} from 'common/config'

const historyIntake = useRouterHistory(createHistory)({
  basename: config().base_path,
})

export default (
  <Router history={historyIntake} >
    <Route path='/' component={App}>
      <IndexRoute component={HomePage} />
      <Route path='people/new' component={PersonNewPage} />
      <Route path='people/:id' component={PersonShowPage} />
      <Route path='people/:id/edit' component={PersonEditPage} />
      <Route path='screenings/:id' component={ScreeningPage}/>
      <Route path='screenings/:id/:mode' component={ScreeningPage} />
    </Route>
  </Router>
)

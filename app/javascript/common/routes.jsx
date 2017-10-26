import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import App from 'common/App'
import HomePage from 'home/HomePage'
import ScreeningPage from 'screenings/ScreeningPage'
import ContactFormContainer from 'investigations/ContactFormContainer'
import ContactShowContainer from 'investigations/ContactShowContainer'
import InvestigationPageContainer from 'investigations/InvestigationPageContainer'
import NotFoundPage from 'errors/NotFoundPage'
import {store} from 'store/configureStore'
import {Provider} from 'react-redux'
import {routerHistory} from 'common/history'
import {createSelectLocationState} from 'reducers/routerReducer'
import {syncHistoryWithStore} from 'react-router-redux'

const history = syncHistoryWithStore(routerHistory, store, {selectLocationState: createSelectLocationState()})

export default (
  <Provider store={store}>
    <Router history={history} >
      <Route path='/' component={App}>
        <IndexRoute component={HomePage} />
        <Route path='screenings/:id' component={ScreeningPage}/>
        <Route path='screenings/:id/:mode' component={ScreeningPage} />
        <Route path='investigations/:id' component={InvestigationPageContainer} />
        <Route path='investigations/:investigation_id/contacts/new' component={ContactFormContainer} />
        <Route path='investigations/:investigation_id/contacts/:id' component={ContactShowContainer} />
        <Route path='investigations/:investigation_id/contacts/:id/edit' component={ContactFormContainer} />
        <Route path='*' component={NotFoundPage}/>
      </Route>
    </Router>
  </Provider>
)

import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import App from 'common/App'
import history from 'common/history'
import HomePage from 'home/HomePage'
import ScreeningPage from 'screenings/ScreeningPage'
import ScreeningSummaryContainer from 'investigations/ScreeningSummaryContainer'
import ContactLogContainer from 'investigations/ContactLogContainer'
import ContactContainer from 'investigations/ContactContainer'
import ContactShowContainer from 'investigations/ContactShowContainer'
import {store} from 'store/configureStore'
import {Provider} from 'react-redux'

const InvestigationPage = (props) => (
  <div>
    <ScreeningSummaryContainer {...props} />
    <ContactLogContainer {...props} />
  </div>
)

export default (
  <Provider store={store}>
    <Router history={history} >
      <Route path='/' component={App}>
        <IndexRoute component={HomePage} />
        <Route path='screenings/:id' component={ScreeningPage}/>
        <Route path='screenings/:id/:mode' component={ScreeningPage} />
        <Route path='investigations/:id' component={InvestigationPage} />
        <Route path='investigations/:investigation_id/contacts/new' component={ContactContainer} />
        <Route path='investigations/:investigation_id/contacts/:id' component={ContactShowContainer} />
      </Route>
    </Router>
  </Provider>
)

import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import App from 'common/App'
import PageLayout from 'common/PageLayout'
import HomePage from 'home/HomePage'
import ScreeningPage from 'screenings/ScreeningPage'
import SnapshotPage from 'snapshots/SnapshotPage'
import ContactFormContainer from 'investigations/ContactFormContainer'
import ContactShowContainer from 'investigations/ContactShowContainer'
import InvestigationPageContainer from 'investigations/InvestigationPageContainer'
import ConditionsOfUse from 'views/pages/ConditionsOfUse'
import PrivacyPolicy from 'views/pages/PrivacyPolicy'
import NotFoundPage from 'errors/NotFoundPage'
import ForbiddenPage from 'errors/ForbiddenPage'
import ServerErrorPage from 'errors/ServerErrorPage'
import {store} from 'store/configureStore'
import {Provider} from 'react-redux'
import {routerHistory} from 'common/history'
import {createSelectLocationState} from 'reducers/routerReducer'
import {syncHistoryWithStore} from 'react-router-redux'
import * as IntakeConfig from 'common/config'

const history = syncHistoryWithStore(routerHistory, store, {selectLocationState: createSelectLocationState()})

const investigationConstraint = IntakeConfig.isFeatureActive('investigations')
const releaseOneConstraint = IntakeConfig.isFeatureActive('release_one')
const releaseTwoConstraint = IntakeConfig.isFeatureActive('release_two')

export default (
  <Provider store={store}>
    <Router history={history} >
      <Route path='/' component={App}>
        <Route component={PageLayout}>
          <IndexRoute component={HomePage} />
          { !releaseTwoConstraint && !releaseOneConstraint &&
          <Route path='screenings/:id' component={ScreeningPage}/> }
          { !releaseTwoConstraint && !releaseOneConstraint &&
          <Route path='screenings/:id/:mode' component={ScreeningPage} /> }
          { releaseTwoConstraint &&
          <Route path='snapshot' component={SnapshotPage}/> }
          { investigationConstraint &&
          <Route path='investigations/:id' component={InvestigationPageContainer} /> }
          { investigationConstraint &&
          <Route path='investigations/:investigation_id/contacts/new' component={ContactFormContainer} /> }
          { investigationConstraint &&
          <Route path='investigations/:investigation_id/contacts/:id' component={ContactShowContainer} /> }
          { investigationConstraint &&
          <Route path='investigations/:investigation_id/contacts/:id/edit' component={ContactFormContainer} /> }
        </Route>
        <Route path='pages/conditions_of_use' component={ConditionsOfUse}/>
        <Route path='pages/privacy_policy' component={PrivacyPolicy}/>
        <Route path='server_error' component={ServerErrorPage}/>
        <Route path='forbidden' component={ForbiddenPage}/>
        <Route path='*' component={NotFoundPage}/>
      </Route>
    </Router>
  </Provider>
)

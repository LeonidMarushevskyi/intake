import {Provider} from 'react-redux'
import {store} from 'store/configureStore'
import {connect} from 'react-redux'
import {getPeopleResultsSelector, getResultsTotalValueSelector, getSearchTermValueSelector} from 'selectors/peopleSearchSelectors'
import {search, setSearchTerm, clear} from 'actions/peopleSearchActions'
import {Router, Route} from 'react-router'
import {routerHistory} from 'common/history'
import {createSelectLocationState} from 'reducers/routerReducer'
import {syncHistoryWithStore} from 'react-router-redux'
import ReleaseOne from 'common/ReleaseOne'
import React from 'react'

const mapStateToProps = (state) => ({
  results: getPeopleResultsSelector(state).toJS(),
  total: getResultsTotalValueSelector(state),
  searchTerm: getSearchTermValueSelector(state),
})
const mapDispatchToProps = (dispatch, _ownProps) => {
  const onClear = () => dispatch(clear())
  const onChange = (value) => dispatch(setSearchTerm(value))
  const onSearch = (value) => dispatch(search(value))
  return {
    onSearch,
    onClear,
    onChange,
  }
}
const history = syncHistoryWithStore(routerHistory, store, {selectLocationState: createSelectLocationState()})
export default (
  <Provider store={store}>
    <Router history={history} >
      <Route path='/' component={connect(mapStateToProps, mapDispatchToProps)(ReleaseOne)} />
    </Router>
  </Provider>
)

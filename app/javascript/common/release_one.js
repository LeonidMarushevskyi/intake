import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'
import {Provider} from 'react-redux'
import {store} from 'store/configureStore'
import React from 'react'
import {connect} from 'react-redux'
import {getPeopleResultsSelector, getResultsTotalValueSelector, getSearchTermValueSelector} from 'selectors/peopleSearchSelectors'
import {search, setSearchTerm, clear} from 'actions/peopleSearchActions'

import {Router, Route} from 'react-router'
import {routerHistory} from 'common/history'
import {createSelectLocationState} from 'reducers/routerReducer'
import {syncHistoryWithStore} from 'react-router-redux'

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
const ReleaseTwo = ({
  onChange = () => null,
  onClear = () => null,
  onSearch = () => null,
  results = [],
  searchTerm = '',
  total = 0,
}) => (
  <div>
    <label className='no-gap' htmlFor='people'>People</label>
    <Autocompleter
      id='people'
      onSelect={() => null}
      isSelectable={() => false}
      footer={false}
      onClear={onClear}
      onSearch={onSearch}
      onChange={onChange}
      searchTerm={searchTerm}
      total={total}
      results={results}
    />
  </div>
)
ReleaseTwo.propTypes = {
  footer: PropTypes.bool,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSearch: PropTypes.func,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}
const history = syncHistoryWithStore(routerHistory, store, {selectLocationState: createSelectLocationState()})
export default (
  <Provider store={store}>
    <Router history={history} >
      <Route path='/' component={connect(mapStateToProps, mapDispatchToProps)(ReleaseTwo)} />
    </Router>
  </Provider>
)

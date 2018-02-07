import {connect} from 'react-redux'
import PersonSearchForm from 'views/people/PersonSearchForm'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {
  getPeopleResultsSelector,
  getResultsTotalValueSelector,
  getSearchTermValueSelector,
} from 'selectors/peopleSearchSelectors'
import {createPerson} from 'actions/personCardActions'
import {search, setSearchTerm, clear, loadMoreResults} from 'actions/peopleSearchActions'

const mapStateToProps = (state) => ({
  screeningId: getScreeningIdValueSelector(state),
  canCreateNewPerson: true,
  hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
  results: getPeopleResultsSelector(state).toJS(),
  total: getResultsTotalValueSelector(state),
  searchPrompt: 'Search for any person (Children, parents, collaterals, reporters, alleged perpetrators...)',
  searchTerm: getSearchTermValueSelector(state),
})

const mapDispatchToProps = (dispatch, _ownProps) => {
  const onClear = () => dispatch(clear())
  const onChange = (value) => dispatch(setSearchTerm(value))
  const onSearch = (value) => dispatch(search(value))
  const onLoadMoreResults = () => dispatch(loadMoreResults())
  return {
    onSearch,
    onClear,
    onChange,
    onLoadMoreResults,
    dispatch,
  }
}

const mergeProps = (stateProps, {onSearch, onClear, onChange, onLoadMoreResults, dispatch}) => {
  const {
    canCreateNewPerson,
    hasAddSensitivePerson,
    results,
    screeningId,
    searchPrompt,
    searchTerm,
    total,
  } = stateProps
  const isSelectable = ({isSensitive}) => (isSensitive === false || hasAddSensitivePerson)
  const onSelect = (person) => {
    const personOnScreening = {
      screening_id: screeningId,
      legacy_descriptor: {
        legacy_id: person.legacyDescriptor && person.legacyDescriptor.legacy_id,
        legacy_source_table: person.legacyDescriptor && person.legacyDescriptor.legacy_table_name,
      },
    }
    onClear()
    onChange('')
    dispatch(createPerson(personOnScreening))
  }
  return {
    canCreateNewPerson,
    isSelectable,
    onChange,
    onClear,
    onLoadMoreResults,
    onSearch,
    onSelect,
    results,
    searchPrompt,
    searchTerm,
    total,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PersonSearchForm)

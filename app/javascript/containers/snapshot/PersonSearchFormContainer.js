import {connect} from 'react-redux'
import PersonSearchForm from 'views/people/PersonSearchForm'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'
import {
  getPeopleResultsSelector,
  getResultsTotalValueSelector,
  getSearchTermValueSelector,
} from 'selectors/peopleSearchSelectors'
import {createSnapshotPerson} from 'actions/personCardActions'
import {search, setSearchTerm, clear, loadMoreResults} from 'actions/peopleSearchActions'

const mapStateToProps = (state) => ({
  snapshotId: getSnapshotIdValueSelector(state),
  canCreateNewPerson: false,
  hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
  results: getPeopleResultsSelector(state).toJS(),
  total: getResultsTotalValueSelector(state),
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

const mergeProps = (stateProps, {dispatch, ...actions}) => {
  const {
    hasAddSensitivePerson,
    snapshotId,
    ...props
  } = stateProps
  const isSelectable = ({isSensitive}) => (isSensitive === false || hasAddSensitivePerson)
  const onSelect = (person) => {
    const personOnSnapshot = {
      snapshotId,
      legacy_descriptor: {
        legacy_id: person.legacyDescriptor && person.legacyDescriptor.legacy_id,
        legacy_source_table: person.legacyDescriptor && person.legacyDescriptor.legacy_table_name,
      },
    }
    actions.onClear()
    actions.onChange('')
    dispatch(createSnapshotPerson(personOnSnapshot))
  }
  return {
    ...actions,
    ...props,
    isSelectable,
    onSelect,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PersonSearchForm)


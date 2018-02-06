import {connect} from 'react-redux'
import PersonCard from 'views/people/PersonCard'
import {
  getPersonNamesSelector,
  getPersonInformationFlagValuesSelector,
} from 'selectors/screening/personCardSelectors'
import {deleteSnapshotPerson} from 'actions/personCardActions'
import {SHOW_MODE} from 'actions/screeningPageActions'

const mapStateToProps = (state, {personId}) => ({
  mode: SHOW_MODE,
  editable: false,
  deletable: true,
  informationFlag: getPersonInformationFlagValuesSelector(state).get(personId),
  personName: getPersonNamesSelector(state).get(personId),
})

const mergeProps = (stateProps, {dispatch}, ownProps) => {
  const {
    personId,
    show,
  } = ownProps

  const onDelete = () => dispatch(deleteSnapshotPerson(personId))

  return {
    ...stateProps,
    onDelete,
    personId,
    show,
  }
}

export default connect(mapStateToProps, null, mergeProps)(PersonCard)


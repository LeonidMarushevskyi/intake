import {connect} from 'react-redux'
import PersonCard from 'views/people/PersonCard'
import {
  getPersonNamesSelector,
  getPersonInformationFlagValuesSelector,
} from 'selectors/screening/peopleCardSelectors'
import {
  deletePerson,
} from 'actions/personCardActions'

const mapStateToProps = (state, ownProps) => ({
  editable: !state.getIn(['screening', 'referral_id']),
  informationFlag: getPersonInformationFlagValuesSelector(state).get(ownProps.personId),
  personName: getPersonNamesSelector(state).get(ownProps.personId),
})
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps
  const {
    editable,
    informationFlag,
    personName,
  } = stateProps
  const {
    edit,
    mode,
    personId,
    show,
    toggleMode,
  } = ownProps

  const onCancel = () => {
    toggleMode()
  }
  const onDelete = () => {
    dispatch(deletePerson(personId))
  }
  const onEdit = () => {
    toggleMode()
  }
  const onSave = () => {
    toggleMode()
  }

  return {
    edit,
    editable,
    informationFlag,
    mode,
    onCancel,
    onDelete,
    onEdit,
    onSave,
    personId,
    personName,
    show,
  }
}

export default connect(mapStateToProps, null, mergeProps)(PersonCard)

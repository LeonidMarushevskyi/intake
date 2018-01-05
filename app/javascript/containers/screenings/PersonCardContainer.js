import {connect} from 'react-redux'
import PersonCard from 'views/people/PersonCard'
import {getPeopleWithEditsSelector} from 'selectors/screening/peopleFormSelectors'
import {
  getModeValueSelector,
  getPersonNamesSelector,
  getPersonInformationFlagValuesSelector,
} from 'selectors/screening/personCardSelectors'
import {savePerson, deletePerson} from 'actions/personCardActions'
import {setPersonCardMode} from 'actions/screeningPageActions'
import {touchAllFields} from 'actions/peopleFormActions'

const mapStateToProps = (state, {personId}) => ({
  mode: getModeValueSelector(state, personId),
  editable: !state.getIn(['screening', 'referral_id']),
  informationFlag: getPersonInformationFlagValuesSelector(state).get(personId),
  personName: getPersonNamesSelector(state).get(personId),
  personWithEdits: getPeopleWithEditsSelector(state).get(personId).toJS(),
})
const mergeProps = (stateProps, {dispatch}, ownProps) => {
  const {
    mode,
    editable,
    informationFlag,
    personName,
    personWithEdits,
  } = stateProps
  const {
    edit,
    personId,
    show,
  } = ownProps

  const onCancel = () => dispatch(setPersonCardMode(personId, 'show'))
  const onDelete = () => dispatch(deletePerson(personId))
  const onEdit = () => dispatch(setPersonCardMode(personId, 'edit'))
  const onSave = () => {
    dispatch(savePerson(personWithEdits))
    dispatch(touchAllFields(personId))
    dispatch(setPersonCardMode(personId, 'show'))
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

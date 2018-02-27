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
  deletable: !state.getIn(['screening', 'referral_id']),
  informationFlag: getPersonInformationFlagValuesSelector(state).get(personId),
  personName: getPersonNamesSelector(state).get(personId),
  personWithEdits: getPeopleWithEditsSelector(state).get(personId).toJS(),
})

const mapDispatchToProps = (dispatch, {personId}) => ({
  onCancel: () => dispatch(setPersonCardMode(personId, 'show')),
  onDelete: () => dispatch(deletePerson(personId)),
  onEdit: () => dispatch(setPersonCardMode(personId, 'edit')),
  onSave: () => {
    dispatch(savePerson(personId))
    dispatch(touchAllFields(personId))
    dispatch(setPersonCardMode(personId, 'show'))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonCard)

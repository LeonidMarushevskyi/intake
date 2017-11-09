import {connect} from 'react-redux'
import {setField, addPhone, deletePhone} from 'actions/peopleFormActions'
import PhoneNumbersForm from 'views/people/PhoneNumbersForm'
import {
  getPersonPhoneNumbersSelector,
  getPhoneNumberTypeOptions,
} from 'selectors/screening/peopleFormSelectors'

const mapStateToProps = (state, {personId}) => (
  {
    phoneNumbers: getPersonPhoneNumbersSelector(state, personId).toJS(),
    phoneTypes: getPhoneNumberTypeOptions().toJS(),
  }
)

const mergeProps = (stateProps, {dispatch}, {personId}) => (
  {
    addPhone: () => dispatch(addPhone(personId)),
    deletePhone: (phoneIndex) => dispatch(deletePhone(personId, phoneIndex)),
    onChange: (phoneIndex, field, value) => {
      dispatch(setField(personId, ['phone_numbers', phoneIndex, field], value))
    },
    ...stateProps,
  }
)

export default connect(mapStateToProps, null, mergeProps)(PhoneNumbersForm)

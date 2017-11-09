import {connect} from 'react-redux'
import PhoneNumbersShow from 'views/people/PhoneNumbersShow'
import {getPersonFormattedPhoneNumbersSelector} from 'selectors/screening/personShowSelectors'

const mapStateToProps = (state, {personId}) => (
  {phoneNumbers: getPersonFormattedPhoneNumbersSelector(state, personId).toJS()}
)

export default connect(mapStateToProps)(PhoneNumbersShow)

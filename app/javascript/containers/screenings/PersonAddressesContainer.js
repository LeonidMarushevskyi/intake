import {connect} from 'react-redux'
import AddressesShow from 'views/people/AddressesShow'
import {getPersonFormattedAddressesSelector} from 'selectors/screening/personShowSelectors'

const mapStateToProps = (state, {personId}) => (
  {addresses: getPersonFormattedAddressesSelector(state, personId).toJS()}
)

export default connect(mapStateToProps)(AddressesShow)


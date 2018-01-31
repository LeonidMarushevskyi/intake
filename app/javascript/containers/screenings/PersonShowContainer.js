import {connect} from 'react-redux'
import {
  getFormattedPersonWithErrorsSelector,
} from 'selectors/screening/personShowSelectors'
import PersonInformationShow from 'views/people/PersonInformationShow'

const mapStateToProps = (state, {personId}) => (
  getFormattedPersonWithErrorsSelector(state, personId).toJS()
)

export default connect(mapStateToProps, {})(PersonInformationShow)

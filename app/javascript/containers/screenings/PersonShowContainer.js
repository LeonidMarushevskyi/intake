import {connect} from 'react-redux'
import {getFormattedPersonInformationSelector} from 'selectors/screening/personShowSelectors'
import PersonInformationShow from 'views/people/PersonInformationShow'

const mapStateToProps = (state, {personId}) => (
  getFormattedPersonInformationSelector(state, personId).toJS()
)

export default connect(mapStateToProps, {})(PersonInformationShow)

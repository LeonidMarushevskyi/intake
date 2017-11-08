import {connect} from 'react-redux'
import {getFormattedPersonInformationSelector} from 'selectors/screening/peopleShowSelectors'
import PersonInformationShow from 'views/people/PersonInformationShow'

const mapStateToProps = (state, {personId}) => (
  getFormattedPersonInformationSelector(state, personId).toJS()
)

export default connect(mapStateToProps, {})(PersonInformationShow)

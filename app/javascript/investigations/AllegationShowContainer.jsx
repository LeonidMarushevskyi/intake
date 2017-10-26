import AllegationShow from 'allegations/AllegationShow'
import {getFormattedAllegationsSelector} from 'selectors/AllegationShowSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {allegations: getFormattedAllegationsSelector(state).toJS()}
)

export default connect(mapStateToProps)(AllegationShow)

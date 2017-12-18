import AllegationShow from 'views/AllegationsShow'
import {getFormattedAllegationsSelector} from 'selectors/investigation/allegationShowSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {allegations: getFormattedAllegationsSelector(state).toJS()}
)

export default connect(mapStateToProps)(AllegationShow)

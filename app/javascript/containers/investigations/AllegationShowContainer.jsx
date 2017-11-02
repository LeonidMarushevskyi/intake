import AllegationShow from 'views/allegations/AllegationShow'
import {getFormattedAllegationsSelector} from 'selectors/allegationShowSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state) => (
  {allegations: getFormattedAllegationsSelector(state).toJS()}
)

export default connect(mapStateToProps)(AllegationShow)

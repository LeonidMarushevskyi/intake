import {connect} from 'react-redux'
import AllegationShow from 'allegations/AllegationShow'
import {getFormattedAllegationsSelector} from 'selectors/screening/allegationShowSelectors'

const mapStateToProps = (state, {alertErrorMessage, required, toggleMode}) => (
  {
    alertErrorMessage,
    allegations: getFormattedAllegationsSelector(state).toJS(),
    onEdit: () => toggleMode(),
    required,
  }
)

export default connect(mapStateToProps)(AllegationShow)

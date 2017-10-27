import {connect} from 'react-redux'
import AllegationShow from 'allegations/AllegationShow'
import {
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
} from 'selectors/screening/allegationShowSelectors'

const mapStateToProps = (state, {alertErrorMessage, toggleMode}) => (
  {
    alertErrorMessage,
    allegations: getFormattedAllegationsSelector(state).toJS(),
    onEdit: () => toggleMode(),
    required: getAllegationsRequiredValueSelector(state),
  }
)

export default connect(mapStateToProps)(AllegationShow)

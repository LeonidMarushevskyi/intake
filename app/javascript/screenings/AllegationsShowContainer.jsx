import {connect} from 'react-redux'
import AllegationShow from 'allegations/AllegationShow'
import {
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationShowSelectors'

const mapStateToProps = (state, {toggleMode}) => (
  {
    alertErrorMessage: getAllegationsAlertErrorMessageSelector(state),
    allegations: getFormattedAllegationsSelector(state).toJS(),
    onEdit: () => toggleMode(),
    required: getAllegationsRequiredValueSelector(state),
  }
)

export default connect(mapStateToProps)(AllegationShow)

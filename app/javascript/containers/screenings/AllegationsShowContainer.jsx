import {connect} from 'react-redux'
import AllegationShow from 'views/allegations/AllegationShow'
import {
  getFormattedAllegationsSelector,
} from 'selectors/screening/allegationShowSelectors'
import {
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'

const mapStateToProps = (state, {toggleMode}) => {
  let props = {
    alertErrorMessage: getAllegationsAlertErrorMessageSelector(state),
    allegations: getFormattedAllegationsSelector(state).toJS(),
    required: getAllegationsRequiredValueSelector(state),
  }
  if (!getScreeningIsReadOnlySelector(state)) {
    props = {
      ...props,
      onEdit: () => toggleMode(),
    }
  }
  return props
}

export default connect(mapStateToProps)(AllegationShow)

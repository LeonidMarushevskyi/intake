import {connect} from 'react-redux'
import AllegationsForm from 'views/AllegationsForm'
import {
  getAllegationTypesSelector,
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {saveCard, clearCardEdits} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {setAllegationTypes} from 'actions/allegationsFormActions'

const mapStateToProps = (state) => (
  {
    alertErrorMessage: getAllegationsAlertErrorMessageSelector(state),
    allegations: getFormattedAllegationsSelector(state).toJS(),
    allegationTypes: getAllegationTypesSelector(state).toJS(),
    required: getAllegationsRequiredValueSelector(state),
  }
)

const mapDispatchToProps = (dispatch) => ({
  onCancel: () => {
    dispatch(clearCardEdits('allegations'))
    dispatch(setCardMode('allegations-card', SHOW_MODE))
  },
  onChange: (props) => {
    dispatch(setAllegationTypes(props))
  },
  onSave: () => {
    dispatch(saveCard('allegations'))
    dispatch(setCardMode('allegations-card', SHOW_MODE))
  },
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(AllegationsForm)


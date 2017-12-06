import {connect} from 'react-redux'
import AllegationsForm from 'views/AllegationsForm'
import {
  getAllegationTypesSelector,
  getFormattedAllegationsSelector,
  getScreeningWithAllegationsEditsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {save as saveScreening} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {
  resetAllegations,
  setAllegationTypes,
} from 'actions/allegationsFormActions'

const mapStateToProps = (state) => (
  {
    alertErrorMessage: getAllegationsAlertErrorMessageSelector(state),
    allegations: getFormattedAllegationsSelector(state).toJS(),
    allegationTypes: getAllegationTypesSelector(state).toJS(),
    persistedAllegations: state.get('screening').get('allegations').toJS(),
    required: getAllegationsRequiredValueSelector(state),
    screeningWithEdits: getScreeningWithAllegationsEditsSelector(state).toJS(),
  }
)

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch} = dispatchProps
  const {
    alertErrorMessage,
    allegations,
    allegationTypes,
    persistedAllegations,
    required,
    screeningWithEdits,
  } = stateProps

  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(setCardMode('allegations-card', SHOW_MODE))
  }

  const onCancel = () => {
    dispatch(resetAllegations({allegations: persistedAllegations}))
    dispatch(setCardMode('allegations-card', SHOW_MODE))
  }

  const onChange = (props) => {
    dispatch(setAllegationTypes(props))
  }

  return {
    alertErrorMessage,
    allegations,
    allegationTypes,
    onCancel,
    onChange,
    onSave,
    required,
  }
}

export default connect(mapStateToProps, null, mergeProps)(AllegationsForm)


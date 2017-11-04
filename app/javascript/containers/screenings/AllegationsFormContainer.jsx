import {connect} from 'react-redux'
import AllegationsForm from 'views/allegations/AllegationsForm'
import {
  getAllegationTypesSelector,
  getFormattedAllegationsSelector,
  getScreeningWithAllegationsEditsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {saveScreening} from 'actions/screeningActions'
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

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps
  const {
    alertErrorMessage,
    allegations,
    allegationTypes,
    persistedAllegations,
    required,
    screeningWithEdits,
  } = stateProps
  const {toggleMode} = ownProps

  const onSave = () => {
    toggleMode()
    dispatch(saveScreening(screeningWithEdits))
  }

  const onCancel = () => {
    toggleMode()
    dispatch(resetAllegations({allegations: persistedAllegations}))
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


import {connect} from 'react-redux'
import AllegationsForm from 'views/AllegationsForm'
import {
  getAllegationTypesSelector,
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {saveCard} from 'actions/screeningActions'
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
  }
)

const mapDispatchToProps = (dispatch) => ({
  onChange: (props) => {
    dispatch(setAllegationTypes(props))
  },
  onSave: () => {
    dispatch(saveCard('allegations'))
    dispatch(setCardMode('allegations-card', SHOW_MODE))
  },
  dispatch,
})

const mergeProps = (stateProps, dispatchProps) => {
  const {dispatch, ...actions} = dispatchProps
  const {persistedAllegations, ...props} = stateProps

  const onCancel = () => {
    dispatch(resetAllegations({allegations: persistedAllegations}))
    dispatch(setCardMode('allegations-card', SHOW_MODE))
  }

  return {
    onCancel,
    ...props,
    ...actions,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AllegationsForm)


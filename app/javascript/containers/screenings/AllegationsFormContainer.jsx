import {connect} from 'react-redux'
import AllegationsForm from 'views/allegations/AllegationsForm'
import {
  getFormattedAllegationsSelector,
  getScreeningWithAllegationsEditsSelector,
} from 'selectors/screening/allegationsFormSelectors'
import {saveScreening} from 'actions/screeningActions'
import {
  resetAllegations,
  setAllegationTypes,
} from 'actions/allegationsFormActions'
import ALLEGATION_TYPES from 'enums/AllegationTypes'

const mapStateToProps = (state) => (
  {
    allegations: getFormattedAllegationsSelector(state).toJS(),
    allegationTypes: ALLEGATION_TYPES.map((type) => ({label: type.value, value: type.value})),
    persistedAllegations: state.get('screening').get('allegations').toJS(),
    screeningWithEdits: getScreeningWithAllegationsEditsSelector(state).toJS(),
  }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps
  const {allegations, allegationTypes, persistedAllegations, screeningWithEdits} = stateProps
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
    allegations,
    allegationTypes,
    onCancel,
    onChange,
    onSave,
  }
}

export default connect(mapStateToProps, null, mergeProps)(AllegationsForm)


import {connect} from 'react-redux'
import AllegationsForm from 'views/allegations/AllegationsForm'
import {
  getFormattedAllegationsSelector,
} from 'selectors/screening/allegationsFormSelectors'
import ALLEGATION_TYPES from 'enums/AllegationTypes'

const mapStateToProps = (state, {toggleMode}) => (
  {
    allegations: getFormattedAllegationsSelector(state).toJS(),
    allegationTypes: ALLEGATION_TYPES.map((type) => ({label: type.value, value: type.value})),
  }
)

export default connect(mapStateToProps)(AllegationsForm)


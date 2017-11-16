import {connect} from 'react-redux'
import PersonSearchForm from 'views/people/PersonSearchForm'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {createPerson} from 'actions/personCardActions'
import * as IntakeConfig from 'common/config'

const mapStateToProps = (state) => (
  {
    screeningId: getScreeningIdValueSelector(state),
    canCreateNewPerson: IntakeConfig.isFeatureInactive('release_two'),
    hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
  }
)

const mergeProps = (stateProps, {dispatch}) => {
  const {screeningId, hasAddSensitivePerson, canCreateNewPerson} = stateProps
  const isSelectable = (person) => (person.sensitive === false || hasAddSensitivePerson)
  const onSelect = (person) => {
    const personOnScreening = {
      ...person,
      screening_id: screeningId,
      legacy_id: person.id,
      id: null,
    }
    dispatch(createPerson(personOnScreening))
  }

  return {canCreateNewPerson, isSelectable, onSelect}
}

export default connect(mapStateToProps, null, mergeProps)(PersonSearchForm)

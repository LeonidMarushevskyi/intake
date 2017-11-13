import {connect} from 'react-redux'
import RaceForm from 'views/people/RaceForm'
import {RACE_DETAILS} from 'enums/Races'
import {getPersonRacesSelector} from 'selectors/screening/peopleFormSelectors'
import {setField} from 'actions/peopleFormActions'

const mapStateToProps = (state, {personId}) => {
  const raceDetails = Object.keys(RACE_DETAILS).reduce((raceDetails, race) => ({
    ...raceDetails,
    [race]: RACE_DETAILS[race].map((value) => ({label: value, value})),
  }), {})
  return {
    personId,
    raceDetails,
    racesDisabled: false,
    races: getPersonRacesSelector(state, personId).toJS(),
  }
}
const mergeProps = (stateProps, {dispatch}, {personId}) => (
  {
    onChange: (field, race, value) => {
      dispatch(setField(personId, ['races', field, race], value))
      if (field === 'race' && !value) {
        dispatch(setField(personId, ['races', 'raceDetail', race], ''))
      }
    },
    ...stateProps,
  }
)
export default connect(mapStateToProps, null, mergeProps)(RaceForm)

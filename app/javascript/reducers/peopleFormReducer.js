import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'

const buildPerson = ({
  first_name,
  last_name,
  legacy_descriptor,
  middle_name,
  name_suffix,
  roles,
  ssn,
}) => fromJS({
  first_name: {value: first_name},
  last_name: {value: last_name},
  legacy_descriptor: {value: legacy_descriptor},
  middle_name: {value: middle_name},
  name_suffix: {value: name_suffix},
  roles: {value: roles},
  ssn: {value: ssn},
})
export default createReducer(Map(), {
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      return screening.participants.reduce((people, participant) => (
        people.set(participant.id, buildPerson(participant))
      ), Map())
    }
  },
})

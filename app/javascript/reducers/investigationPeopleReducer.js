import {createReducer} from 'utils/createReducer'
import {fromJS, List} from 'immutable'
import {FETCH_INVESTIGATION_PEOPLE_SUCCESS} from 'actions/investigationPeopleActions'

const getInvestigationPeople = (state, {people}) => (fromJS(people))

export default createReducer(List(), {
  [FETCH_INVESTIGATION_PEOPLE_SUCCESS]: getInvestigationPeople,
})

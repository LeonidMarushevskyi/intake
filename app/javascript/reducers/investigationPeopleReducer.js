import {createReducer} from 'utils/createReducer'
import {fromJS, List} from 'immutable'
import {FETCH_INVESTIGATION_PEOPLE_SUCCESS} from 'actions/investigationPeopleActions'
import {FETCH_INVESTIGATION_SUCCESS} from 'actions/investigationActions'

const getPeople = (_, {people}) => fromJS(people)
const getPeopleOnInvestigation = (_, {investigation}) => fromJS(investigation.people)

export default createReducer(List(), {
  [FETCH_INVESTIGATION_PEOPLE_SUCCESS]: getPeople,
  [FETCH_INVESTIGATION_SUCCESS]: getPeopleOnInvestigation,
})

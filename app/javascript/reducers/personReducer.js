import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export default function personReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case types.FETCH_PERSON_SUCCESS:
    case types.CREATE_PERSON_SUCCESS:
    case types.UPDATE_PERSON_SUCCESS:
      return action.person
    default:
      return state
  }
}

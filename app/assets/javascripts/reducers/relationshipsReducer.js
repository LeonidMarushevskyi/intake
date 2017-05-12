import * as types from 'actions/actionTypes'
import Immutable from 'immutable'

export default function relationshipsReducer(state = Immutable.List(), action) {
  switch (action.type) {
    case types.FETCH_RELATIONSHIPS_SUCCESS:
      return action.relationships
    default:
      return state
  }
}

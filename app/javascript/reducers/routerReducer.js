import {fromJS} from 'immutable'
import {createReducer} from 'utils/createReducer'
import {LOCATION_CHANGE} from 'react-router-redux'

export function createSelectLocationState() {
  let [prevRoutingState, prevRoutingStateJS] = [undefined, undefined]
  return (state) => {
    const routingState = state.get('routing')
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      [prevRoutingState, prevRoutingStateJS] = [routingState, routingState.toJS()]
    }
    return prevRoutingStateJS
  }
}

const initialState = fromJS({locationBeforeTransitions: null})
export default createReducer(initialState, {
  [LOCATION_CHANGE](state, {payload}) {
    return state.merge({locationBeforeTransitions: payload})
  },
})


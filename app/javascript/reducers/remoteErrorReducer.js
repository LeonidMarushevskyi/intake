import {HTTP_COMPLETE} from 'actions/httpActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [HTTP_COMPLETE](state, {payload, error}) {
    return error ? state.set(payload.url, fromJS(payload)) : state.delete(payload.url)
  },
})

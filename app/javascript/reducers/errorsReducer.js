import {HTTP_COMPLETE} from 'actions/httpActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [HTTP_COMPLETE](state, {payload: {url, response}, error}) {
    return error ? state.set(url, fromJS(response)) : state.delete(url)
  },
})

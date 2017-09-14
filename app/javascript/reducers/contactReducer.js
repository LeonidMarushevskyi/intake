import {SET_CONTACT} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [SET_CONTACT](_state, {investigation_id, started_at, status}) {
    return fromJS(
      {
        investigation_id: {
          value: investigation_id,
          touched: false,
        },
        started_at: {
          value: started_at,
          touched: false,
        },
        status: {
          value: status,
          touched: false,
        },
      }
    )
  },
})

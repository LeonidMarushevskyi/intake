import {createReducer} from 'utils/createReducer'
import {fromJS} from 'immutable'

const initialState = fromJS([
  {code: 'S', value: 'Scheduled'},
  {code: 'A', value: 'Attempted'},
  {code: 'C', value: 'Completed'},
])
export default createReducer(initialState, { })

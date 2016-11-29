import person from 'reducers/personReducer'
import screening from 'reducers/screeningReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  person,
  screening,
})

export default rootReducer

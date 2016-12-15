import person from 'reducers/personReducer'
import screening from 'reducers/screeningReducer'
import participants from 'reducers/participantsReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  person,
  screening,
  participants,
})

export default rootReducer

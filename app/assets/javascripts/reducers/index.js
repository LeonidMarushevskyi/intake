import involvements from 'reducers/involvementsReducer'
import participants from 'reducers/participantsReducer'
import person from 'reducers/personReducer'
import screening from 'reducers/screeningReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  involvements,
  participants,
  person,
  screening,
})

export default rootReducer

import involvements from 'reducers/involvementsReducer'
import participants from 'reducers/participantsReducer'
import person from 'reducers/personReducer'
import relationships from 'reducers/relationshipsReducer'
import screening from 'reducers/screeningReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  involvements,
  participants,
  person,
  relationships,
  screening,
})

export default rootReducer

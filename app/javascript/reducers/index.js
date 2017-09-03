import involvements from 'reducers/involvementsReducer'
import participants from 'reducers/participantsReducer'
import relationships from 'reducers/relationshipsReducer'
import screening from 'reducers/screeningReducer'
import staff from 'reducers/staffReducer'
import screeningSummary from 'reducers/screeningSummaryReducer'
import {combineReducers} from 'redux-immutable'

const rootReducer = combineReducers({
  involvements,
  participants,
  relationships,
  screening,
  staff,
  screeningSummary,
})

export default rootReducer

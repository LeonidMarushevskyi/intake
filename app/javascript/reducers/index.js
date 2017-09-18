import involvements from 'reducers/involvementsReducer'
import participants from 'reducers/participantsReducer'
import relationships from 'reducers/relationshipsReducer'
import remoteError from 'reducers/remoteErrorReducer'
import screening from 'reducers/screeningReducer'
import staff from 'reducers/staffReducer'
import screeningSummary from 'reducers/screeningSummaryReducer'
import contact from 'reducers/contactReducer'
import contactStatuses from 'reducers/systemCodes/contactStatusesReducer'
import {combineReducers} from 'redux-immutable'

const rootReducer = combineReducers({
  involvements,
  participants,
  relationships,
  screening,
  staff,
  screeningSummary,
  remoteError,
  contact,
  contactStatuses,
})

export default rootReducer

import investigationPeople from 'reducers/investigationPeopleReducer'
import involvements from 'reducers/involvementsReducer'
import participants from 'reducers/participantsReducer'
import relationships from 'reducers/relationshipsReducer'
import remoteError from 'reducers/remoteErrorReducer'
import screening from 'reducers/screeningReducer'
import staff from 'reducers/staffReducer'
import screeningSummary from 'reducers/screeningSummaryReducer'
import contactForm from 'reducers/contactFormReducer'
import contactStatuses from 'reducers/systemCodes/contactStatusesReducer'
import contactPurposes from 'reducers/systemCodes/contactPurposesReducer'
import communicationMethods from 'reducers/systemCodes/communicationMethodsReducer'
import countyCodes from 'reducers/systemCodes/countyCodesReducer'
import locations from 'reducers/systemCodes/locationsReducer'
import routing from 'reducers/routerReducer'
import {combineReducers} from 'redux-immutable'

const rootReducer = combineReducers({
  communicationMethods,
  contactForm,
  contactPurposes,
  contactStatuses,
  countyCodes,
  investigationPeople,
  involvements,
  locations,
  participants,
  relationships,
  remoteError,
  routing,
  screening,
  screeningSummary,
  staff,
})

export default rootReducer

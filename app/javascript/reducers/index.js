import communicationMethods from 'reducers/systemCodes/communicationMethodsReducer'
import contactForm from 'reducers/contactFormReducer'
import contactPurposes from 'reducers/systemCodes/contactPurposesReducer'
import contactStatuses from 'reducers/systemCodes/contactStatusesReducer'
import counties from 'reducers/systemCodes/countiesReducer'
import countyAgencies from 'reducers/systemCodes/countyAgenciesReducer'
import investigationPeople from 'reducers/investigationPeopleReducer'
import involvements from 'reducers/involvementsReducer'
import locations from 'reducers/systemCodes/locationsReducer'
import participants from 'reducers/participantsReducer'
import relationships from 'reducers/relationshipsReducer'
import remoteError from 'reducers/remoteErrorReducer'
import routing from 'reducers/routerReducer'
import screening from 'reducers/screeningReducer'
import screeningSummary from 'reducers/screeningSummaryReducer'
import staff from 'reducers/staffReducer'
import {combineReducers} from 'redux-immutable'

const rootReducer = combineReducers({
  communicationMethods,
  contactForm,
  contactPurposes,
  contactStatuses,
  counties,
  countyAgencies,
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

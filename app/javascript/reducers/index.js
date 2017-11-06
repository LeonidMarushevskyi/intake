import allegationsForm from 'reducers/allegationsFormReducer'
import allegationTypes from 'reducers/systemCodes/allegationTypesReducer'
import communicationMethods from 'reducers/systemCodes/communicationMethodsReducer'
import contact from 'reducers/contactReducer'
import contactForm from 'reducers/contactFormReducer'
import contactPurposes from 'reducers/systemCodes/contactPurposesReducer'
import contactStatuses from 'reducers/systemCodes/contactStatusesReducer'
import counties from 'reducers/systemCodes/countiesReducer'
import countyAgencies from 'reducers/systemCodes/countyAgenciesReducer'
import crossReportForm from 'reducers/crossReportFormReducer'
import investigation from 'reducers/investigationReducer'
import involvements from 'reducers/involvementsReducer'
import locations from 'reducers/systemCodes/locationsReducer'
import narrativeForm from 'reducers/narrativeFormReducer'
import participants from 'reducers/participantsReducer'
import relationships from 'reducers/relationshipsReducer'
import remoteError from 'reducers/remoteErrorReducer'
import routing from 'reducers/routerReducer'
import screening from 'reducers/screeningReducer'
import screenings from 'reducers/screeningsReducer'
import staff from 'reducers/staffReducer'
import {combineReducers} from 'redux-immutable'

const rootReducer = combineReducers({
  allegationsForm,
  allegationTypes,
  communicationMethods,
  contact,
  contactForm,
  contactPurposes,
  contactStatuses,
  counties,
  countyAgencies,
  crossReportForm,
  investigation,
  involvements,
  locations,
  narrativeForm,
  participants,
  relationships,
  remoteError,
  routing,
  screening,
  screenings,
  staff,
})

export default rootReducer

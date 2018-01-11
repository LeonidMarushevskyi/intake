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
import errors from 'reducers/errorsReducer'
import incidentInformationForm from 'reducers/incidentInformationFormReducer'
import investigation from 'reducers/investigationReducer'
import involvements from 'reducers/involvementsReducer'
import locations from 'reducers/systemCodes/locationsReducer'
import narrativeForm from 'reducers/narrativeFormReducer'
import participants from 'reducers/participantsReducer'
import peopleForm from 'reducers/peopleFormReducer'
import peopleSearch from 'reducers/peopleSearchReducer'
import relationships from 'reducers/relationshipsReducer'
import routing from 'reducers/routerReducer'
import screening from 'reducers/screeningReducer'
import screeningInformationForm from 'reducers/screeningInformationFormReducer'
import screeningDecisionForm from 'reducers/screeningDecisionFormReducer'
import screenings from 'reducers/screeningsReducer'
import screeningPage from 'reducers/screeningPageReducer'
import staff from 'reducers/staffReducer'
import workerSafetyForm from 'reducers/workerSafetyFormReducer'
import {combineReducers} from 'redux-immutable'
import userInfo from 'reducers/userInfoReducer'

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
  errors,
  incidentInformationForm,
  investigation,
  involvements,
  locations,
  narrativeForm,
  participants,
  peopleForm,
  peopleSearch,
  relationships,
  routing,
  screening,
  screeningInformationForm,
  screeningDecisionForm,
  screenings,
  screeningPage,
  staff,
  workerSafetyForm,
  userInfo,
})

export default rootReducer

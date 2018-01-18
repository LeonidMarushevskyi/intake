import addressTypes from 'reducers/systemCodes/addressTypesReducer'
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
import languages from 'reducers/systemCodes/languagesReducer'
import locations from 'reducers/systemCodes/locationsReducer'
import unableToDetermineCodes from 'reducers/systemCodes/unableToDetermineCodesReducer'
import hispanicOriginCodes from 'reducers/systemCodes/hispanicOriginCodesReducer'
import ethnicityTypes from 'reducers/systemCodes/ethnicityTypesReducer'
import raceTypes from 'reducers/systemCodes/raceTypesReducer'
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
import usStates from 'reducers/systemCodes/usStatesReducer'

const rootReducer = combineReducers({
  addressTypes,
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
  ethnicityTypes,
  raceTypes,
  incidentInformationForm,
  investigation,
  involvements,
  languages,
  locations,
  unableToDetermineCodes,
  hispanicOriginCodes,
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
  usStates,
})

export default rootReducer

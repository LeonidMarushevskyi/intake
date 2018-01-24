import COUNTIES from 'enums/Counties'
import US_STATE from 'enums/USState'
import LOCATION_TYPE from 'enums/LocationType'
import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {isFutureDatetimeCreate, combineCompact} from 'utils/validator'

export const getIncidentInformationFormSelector = (state) => state.get('incidentInformationForm', Map())

export const getIncidentDateSelector = createSelector(
  getIncidentInformationFormSelector,
  (incidentInformationForm) => incidentInformationForm.getIn(['incident_date', 'value'], '') || ''
)

export const getIncidentCountySelector = createSelector(
  getIncidentInformationFormSelector,
  (incidentInformationForm) => incidentInformationForm.getIn(['incident_county', 'value']) || ''
)

export const getAddressSelector = createSelector(
  getIncidentInformationFormSelector,
  (store) => store.getIn(['incidentInformationForm', 'address', 'state', 'value']),
  (incidentInformationForm, usState) => fromJS({
    city: incidentInformationForm.getIn(['address', 'city', 'value'], '') || '',
    streetAddress: incidentInformationForm.getIn(['address', 'street_address', 'value'], '') || '',
    state: usState,
    zip: incidentInformationForm.getIn(['address', 'zip', 'value'], '') || '',
  })
)

export const getLocationTypeSelector = createSelector(
  getIncidentInformationFormSelector,
  (incidentInformationForm) => incidentInformationForm.getIn(['location_type', 'value'], '')
)

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  (state) => state.getIn(['incidentInformationForm', 'incident_date', 'value']),
  (state) => state.getIn(['incidentInformationForm', 'incident_county', 'value']),
  (state) => (state.getIn(['incidentInformationForm', 'address']) || Map()).map((value) => (value.get('value'))),
  (state) => state.getIn(['incidentInformationForm', 'location_type', 'value']),
  (screening, incidentDate, incidentCounty, address, locationType) => (
    screening.set('incident_date', incidentDate)
      .set('incident_county', incidentCounty)
      .set('address', (screening.get('address') || Map()).map((value, key) => (address.get(key) || value)))
      .set('location_type', locationType)
  )
)

export const getTouchedFieldsSelector = createSelector(
  (state) => state.get('incidentInformationForm'),
  (incidentInformationForm) => incidentInformationForm.filter((field) => field.get('touched')).keySeq()
)

export const getErrorsSelector = createSelector(
  (state) => state.getIn(['incidentInformationForm', 'incident_date', 'value']),
  (incident_date) => (fromJS({
    incident_date: combineCompact(isFutureDatetimeCreate(incident_date, 'The incident date and time cannot be in the future.')),
  }))
)

export const getVisibleErrorsSelector = createSelector(
  getErrorsSelector,
  getTouchedFieldsSelector,
  (errors, touchedFields) => errors.reduce(
    (filteredErrors, fieldErrors, field) => {
      if (touchedFields.includes(field)) {
        return filteredErrors.set(field, fieldErrors)
      } else {
        return filteredErrors.set(field, List())
      }
    },
    Map()
  )
)

export const getCounties = () =>
  Object.keys(COUNTIES).map((item) => ({key: item, name: COUNTIES[item]}))

export const getStates = () => US_STATE

export const getLocationTypes = () =>
  Object.keys(LOCATION_TYPE).map((key) => ({name: key, locations: LOCATION_TYPE[key]}))

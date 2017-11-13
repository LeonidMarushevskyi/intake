import {fromJS, Map} from 'immutable'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
  getErrorsSelector,
} from 'selectors/screening/incidentInformationShowSelector'
import * as matchers from 'jasmine-immutable-matchers'
import moment from 'moment'

describe('incidentInformationShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const emptyState = fromJS({address: {}})

  describe('getIncidentDateSelector', () => {
    it('return an incident date or empty string if there is no incident date', () => {
      const screening = {
        incident_date: '2009-01-02',
      }
      const state = fromJS({screening})
      expect(getIncidentDateSelector(state)).toEqual('01/02/2009')
      expect(getIncidentDateSelector(emptyState)).toEqual('')
    })
  })

  describe('getIncidentCountySelector', () => {
    it('return an incident county or empty string if there is no incident county', () => {
      const screening = {
        incident_county: 'yolo',
      }
      const state = fromJS({screening})
      expect(getIncidentCountySelector(state)).toEqual('Yolo')
      expect(getIncidentCountySelector(emptyState)).toEqual('')
    })
  })

  describe('getAddressSelector', () => {
    it('return address properties or an object with empty string if there is no address', () => {
      const screening = {
        address: {
          city: 'Sacramento',
          street_address: '1234 C Street',
          state: 'CA',
          zip: '98765',
        },
      }
      const state = fromJS({screening})
      expect(getAddressSelector(state)).toEqualImmutable(fromJS({
        city: 'Sacramento',
        streetAddress: '1234 C Street',
        state: 'California',
        zip: '98765',
      }))
      expect(getAddressSelector(emptyState)).toEqualImmutable(Map({
        city: '',
        streetAddress: '',
        state: '',
        zip: '',
      }))
    })
  })

  describe('getLocationTypeSelector', () => {
    it('returns a location type or empty string if there is no location type', () => {
      const screening = {
        location_type: 'location type',
      }
      const state = fromJS({screening})
      expect(getLocationTypeSelector(state)).toEqual('location type')
      expect(getLocationTypeSelector(emptyState)).toEqual('')
    })
  })

  describe('getErrorsSelector', () => {
    it('returns an error if the incident date fails to validate', () => {
      const screening = {
        incident_date: moment().add(10, 'days').toISOString(),
      }
      const state = fromJS({screening})
      expect(getErrorsSelector(state)).toEqualImmutable(fromJS({
        incident_date: ['The incident date and time cannot be in the future.'],
      }))
    })

    it('does not return an error if the incident date successfully validates', () => {
      const screening = {
        incident_date: moment().toISOString(),
      }
      const state = fromJS({screening})
      expect(getErrorsSelector(state)).toEqualImmutable(fromJS({
        incident_date: [],
      }))
    })
  })
})

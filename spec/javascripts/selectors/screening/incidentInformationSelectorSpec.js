import {fromJS, Map} from 'immutable'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
} from 'selectors/screening/incidentInformationSelector'
import * as matchers from 'jasmine-immutable-matchers'

describe('incidentInformationSelectors', () => {
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
})

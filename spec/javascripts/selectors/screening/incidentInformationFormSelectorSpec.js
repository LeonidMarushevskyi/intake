import {fromJS, List} from 'immutable'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
  getScreeningWithEditsSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/incidentInformationFormSelector'
import * as matchers from 'jasmine-immutable-matchers'
import moment from 'moment'

describe('incidentInformationFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const emptyState = fromJS({address: {}})

  describe('getIncidentDateSelector', () => {
    it('return an incident date or empty string if there is no incident date', () => {
      const incidentInformationForm = {
        incident_date: {
          value: '2009-01-02',
        },
      }
      const state = fromJS({incidentInformationForm})
      expect(getIncidentDateSelector(state)).toEqual('2009-01-02')
      expect(getIncidentDateSelector(emptyState)).toEqual('')
    })
  })

  describe('getIncidentCountySelector', () => {
    it('return an incident county or undefined if there is no incident county', () => {
      const incidentInformationForm = {
        incident_county: {
          value: 'yolo',
        },
      }
      const state = fromJS({incidentInformationForm})
      expect(getIncidentCountySelector(state)).toEqual('yolo')
      expect(getIncidentCountySelector(emptyState)).toEqual('')
    })
  })

  describe('getAddressSelector', () => {
    it('return address properties or an object with empty string if there is no address', () => {
      const incidentInformationForm = {
        address: {
          city: {
            value: 'Sacramento',
          },
          street_address: {
            value: '1234 C Street',
          },
          state: {
            value: 'CA',
          },
          zip: {
            value: '98765',
          },
        },
      }
      const state = fromJS({incidentInformationForm})
      expect(getAddressSelector(state)).toEqualImmutable(fromJS({
        city: 'Sacramento',
        streetAddress: '1234 C Street',
        state: 'CA',
        zip: '98765',
      }))
      expect(getAddressSelector(emptyState)).toEqualImmutable(fromJS({
        city: '',
        streetAddress: '',
        state: undefined,
        zip: '',
      }))
    })
  })

  describe('getLocationTypeSelector', () => {
    it('returns a location type or empty string if there is no location type', () => {
      const incidentInformationForm = {
        location_type: {
          value: 'location type',
        },
      }
      const state = fromJS({incidentInformationForm})
      expect(getLocationTypeSelector(state)).toEqual('location type')
      expect(getLocationTypeSelector(emptyState)).toEqual('')
    })
  })

  describe('getScreeningWithEditsSelector', () => {
    it('returns the screening with edits', () => {
      const screening = {
        incident_date: '1/2/2009',
        incident_county: 'old county',
        address: {
          street_address: 'old address',
          city: 'old city',
          state: 'old state',
          zip: 'old zip',
        },
        location_type: 'old location type',
      }
      const incidentInformationForm = {
        incident_date: {
          value: '1/3/2009',
        },
        incident_county: {
          value: 'new county',
        },
        address: {
          street_address: {
            value: 'new address',
          },
          city: {
            value: 'new city',
          },
          state: {
            value: 'new state',
          },
          zip: {
            value: 'new zip',
          },
        },
        location_type: {
          value: 'new location type',
        },
      }
      const state = fromJS({incidentInformationForm, screening})
      expect(getScreeningWithEditsSelector(state)).toEqualImmutable(fromJS({
        incident_date: '1/3/2009',
        incident_county: 'new county',
        address: {
          street_address: 'new address',
          city: 'new city',
          state: 'new state',
          zip: 'new zip',
        },
        location_type: 'new location type',
      }))
    })

    it('returns the screening with null address', () => {
      const screening = {
        incident_date: '1/2/2009',
        incident_county: 'old county',
        address: null,
        location_type: 'old location type',
      }
      const incidentInformationForm = {
        incident_date: {
          value: '1/3/2009',
        },
        incident_county: {
          value: 'new county',
        },
        address: null,
        location_type: {
          value: 'new location type',
        },
      }
      const state = fromJS({incidentInformationForm, screening})
      expect(getScreeningWithEditsSelector(state)).toBeImmutable()
    })
  })

  describe('getVisibleErrorsSelector', () => {
    it('returns an error if the field has a validation and is touched', () => {
      const incidentInformationForm = {
        incident_date: {
          value: moment().add(10, 'days').toISOString(),
          touched: true,
        },
      }
      const state = fromJS({incidentInformationForm})
      expect(getVisibleErrorsSelector(state).get('incident_date'))
        .toEqualImmutable(List(['The incident date and time cannot be in the future.']))
    })

    it('does not return an error if the field has not been touched', () => {
      const incidentInformationForm = {
        incident_date: {
          value: moment(),
          touched: false,
        },
      }
      const state = fromJS({incidentInformationForm})
      expect(getVisibleErrorsSelector(state).get('incident_date'))
        .toEqualImmutable(List())
    })
  })
})

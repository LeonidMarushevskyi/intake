import {fromJS, List} from 'immutable'
import {
  getStatusValueSelector,
  getPurposeValueSelector,
  getLocationValueSelector,
  getCommunicationMethodValueSelector,
  getFormattedPeopleSelector,
} from 'selectors/contactSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('contactSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getStatusValueSelector', () => {
    const contactStatuses = [{code: 'A', value: 'Attempted'}]

    it('returns the current contact status display value', () => {
      const contact = {status: 'A'}
      const state = fromJS({contact, contactStatuses})
      expect(getStatusValueSelector(state)).toEqual('Attempted')
    })

    it('returns undefined when contact does not have a status', () => {
      const contact = {status: null}
      const state = fromJS({contact, contactStatuses})
      expect(getStatusValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getPurposeValueSelector', () => {
    const contactPurposes = [{code: '123', value: 'SomePurpose'}]

    it('returns the current contact purpose display value', () => {
      const contact = {purpose: '123'}
      const state = fromJS({contact, contactPurposes})
      expect(getPurposeValueSelector(state)).toEqual('SomePurpose')
    })

    it('returns undefined when contact does not have a purpose', () => {
      const contact = {purpose: null}
      const state = fromJS({contact, contactPurposes})
      expect(getPurposeValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getLocationValueSelector', () => {
    const locations = [{code: '444', value: 'school'}]

    it('returns the current contact location display value', () => {
      const contact = {location: '444'}
      const state = fromJS({contact, locations})
      expect(getLocationValueSelector(state)).toEqual('school')
    })

    it('returns undefined when contact does not have a location', () => {
      const contact = {location: null}
      const state = fromJS({contact, locations})
      expect(getLocationValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getCommunicationMethodValueSelector', () => {
    const communicationMethods = [{code: '555', value: 'Phone'}]

    it('returns the current contact communication methods display value', () => {
      const contact = {communication_method: '555'}
      const state = fromJS({contact, communicationMethods})
      expect(getCommunicationMethodValueSelector(state)).toEqual('Phone')
    })

    it('returns undefined when contact does not have a communication method', () => {
      const contact = {communication_method: null}
      const state = fromJS({contact, communicationMethods})
      expect(getCommunicationMethodValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getFormattedPeopleSelector', () => {
    it('returns the list of formatted names of people present on contact', () => {
      const contact = {
        people: [
          {first_name: 'Robert', middle_name: 'Dolf', last_name: 'Jones'},
          {first_name: 'Sally', last_name: 'Doe'},
        ],
      }
      const state = fromJS({contact})
      expect(getFormattedPeopleSelector(state)).toEqualImmutable(
        fromJS([
          'Robert Dolf Jones',
          'Sally Doe',
        ])
      )
    })

    it('returns an empty list if there are no contact people', () => {
      const contact = {}
      const state = fromJS({contact})
      expect(getFormattedPeopleSelector(state)).toEqualImmutable(List())
    })
  })
})

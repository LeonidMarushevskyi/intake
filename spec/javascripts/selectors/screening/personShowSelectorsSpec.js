import {fromJS, List} from 'immutable'
import {
  getPersonFormattedPhoneNumbersSelector,
} from 'selectors/screening/personShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('workerSafetyFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getPersonFormattedPhoneNumbersSelector', () => {
    it('returns info for the person with the passed id', () => {
      const people = [
        {id: '1', phone_numbers: [{type: 'Home'}]},
        {id: '2', phone_numbers: [{type: 'Cell'}]},
      ]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1').first().get('type'))
        .toEqual('Home')
    })

    it('returns an empty array if no phone numbers exists for the person', () => {
      const people = [{id: '1'}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1')).toEqualImmutable(List())
    })

    it('returns a formatted phone number for number', () => {
      const people = [{id: '1', phone_numbers: [{number: '0123456789'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1').first().get('number'))
        .toEqual('(012)345-6789')
    })

    it('returns the type for a number', () => {
      const people = [{id: '1', phone_numbers: [{type: 'Home'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1').first().get('type'))
        .toEqual('Home')
    })
  })
})

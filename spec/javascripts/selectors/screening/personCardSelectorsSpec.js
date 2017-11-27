import {fromJS} from 'immutable'
import {
  getPersonNamesSelector,
  getPersonInformationFlagValuesSelector,
} from 'selectors/screening/personCardSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('personCardSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getPersonNamesSelector', () => {
    it('returns the formatted name for each participant', () => {
      const participants = [
        {id: '123', first_name: '', middle_name: '', last_name: ''},
        {id: '124', first_name: 'John', middle_name: 'Q', last_name: 'Public'},
        {id: '125', first_name: 'Jane', middle_name: '', last_name: 'Public'},
      ]
      const state = fromJS({participants})
      expect(getPersonNamesSelector(state)).toEqualImmutable(fromJS({
        123: 'Unknown Person',
        124: 'John Q Public',
        125: 'Jane Public',
      }))
    })
  })
  describe('getPersonInformationFlagValuesSelector', () => {
    it('returns the information flag each participant', () => {
      const participants = [
        {id: '123', sensitive: true, sealed: false},
        {id: '124', sensitive: false, sealed: true},
        {id: '125', sensitive: false, sealed: false},
      ]
      const state = fromJS({participants})
      expect(getPersonInformationFlagValuesSelector(state)).toEqualImmutable(fromJS({
        123: 'Sensitive',
        124: 'Sealed',
        125: undefined,
      }))
    })
  })
})

import {fromJS, List} from 'immutable'
import {
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
} from 'selectors/screening/allegationShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('allegationShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getFormattedAllegations', () => {
    it('returns an empty list when no allegations are present', () => {
      const state = fromJS({screening: {}})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(List())
    })

    it('when allegations are present, returns a list of formatted values', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith'},
        {id: '2', first_name: 'Jane', last_name: 'Doe'},
        {id: '3', first_name: 'Sally', last_name: 'Smith'},
        {id: '4', first_name: 'John', last_name: 'Doe'},
      ]
      const allegations = [
        {
          victim_id: '1',
          perpetrator_id: '2',
          allegation_types: ['General neglect', 'Severe neglect'],
        },
        {
          victim_id: '3',
          perpetrator_id: '4',
          allegation_types: ['Physical abuse'],
        },
      ]
      const state = fromJS({screening: {participants, allegations}})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([
        {victim: 'John Smith', perpetrator: 'Jane Doe', type: 'General neglect'},
        {victim: 'John Smith', perpetrator: 'Jane Doe', type: 'Severe neglect'},
        {victim: 'Sally Smith', perpetrator: 'John Doe', type: 'Physical abuse'},
      ]))
    })
  })

  describe('getAllegationsRequiredValueSelector', () => {
    it('returns false when the screening decision is not promote_to_referral', () => {
      const state = fromJS({screening: {screening_decision: 'blah'}})
      expect(getAllegationsRequiredValueSelector(state)).toEqual(false)
    })

    it('returns true when screening decision is promote_to_referral', () => {
      const state = fromJS({screening: {screening_decision: 'promote_to_referral'}})
      expect(getAllegationsRequiredValueSelector(state)).toEqual(true)
    })
  })
})

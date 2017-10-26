import {fromJS, List} from 'immutable'
import {
  getFormattedAllegationsSelector,
} from 'selectors/allegationShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('allegationShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const allegationTypes = [
    {code: 'G', value: 'General Neglect'},
    {code: 'S', value: 'Severe Neglect'},
  ]

  describe('getFormattedAllegations', () => {
    it('returns an empty list when no allegations are present', () => {
      const state = fromJS({investigation: {}})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(List())
    })

    it('when allegations are present, returns a list of formatted values', () => {
      const allegations = [
        {
          victim: {first_name: 'John', last_name: 'Smith'},
          perpetrator: {first_name: 'Jane', last_name: 'Doe'},
          allegation_type: 'G',
        },
        {
          victim: {first_name: 'Sally', last_name: 'Smith'},
          perpetrator: {first_name: 'John', last_name: 'Doe'},
          allegation_type: 'S',
        },
      ]
      const state = fromJS({allegationTypes, investigation: {allegations}})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([
        {victim: 'John Smith', perpetrator: 'Jane Doe', type: 'General Neglect'},
        {victim: 'Sally Smith', perpetrator: 'John Doe', type: 'Severe Neglect'},
      ]))
    })
  })
})

import {fromJS, Set} from 'immutable'
import {
  getAllegationTypesSelector,
} from 'selectors/screeningSummarySelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('getAllegationTypesSelector', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  it('returns the unique set of allegation types on a screening summary', () => {
    const screening = {
      allegations: [
        {allegation_types: ['physical abuse', 'sexual abuse']},
        {allegation_types: ['sexual abuse', 'neglect']},
        {allegation_types: ['physical abuse']},
      ],
    }
    const state = fromJS({investigation: {screening}})
    expect(getAllegationTypesSelector(state)).toEqualImmutable(Set([
      'physical abuse', 'sexual abuse', 'neglect',
    ]))
  })

  it('returns empty immutable list when allegations are undefined', () => {
    const screening = {allegations: undefined}
    const state = fromJS({investigation: {screening}})
    expect(getAllegationTypesSelector(state)).toEqualImmutable(Set())
  })
})

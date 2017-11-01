import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess, fetchFailure} from 'actions/investigationActions'
import investigationReducer from 'reducers/investigationReducer'
import {Map, fromJS} from 'immutable'

describe('investigationReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const investigation = {started_at: '01/02/2016', people: [{first_name: 'Bob'}]}

  describe('on FETCH_INVESTIGATION_COMPLETE', () => {
    it('returns the investigation on success', () => {
      const action = fetchSuccess(investigation)
      expect(investigationReducer(Map(), action)).toEqualImmutable(
        fromJS(investigation)
      )
    })
    it('returns the last state on failure', () => {
      const action = fetchFailure(investigation)
      expect(investigationReducer(Map(), action)).toEqualImmutable(
        Map()
      )
    })
  })
})

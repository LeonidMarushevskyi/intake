import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess} from 'actions/investigationActions'
import investigationReducer from 'reducers/investigationReducer'
import {Map, fromJS} from 'immutable'

describe('investigationReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const investigation = {started_at: '01/02/2016', people: [{first_name: 'Bob'}]}

  describe('on FETCH_INVESTIGATION_SUCCESS', () => {
    it('returns the investigation', () => {
      const action = fetchSuccess(investigation)
      expect(investigationReducer(Map(), action)).toEqualImmutable(
        fromJS(investigation)
      )
    })
  })
})

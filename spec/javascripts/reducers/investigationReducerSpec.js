import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess} from 'actions/investigationActions'
import investigationReducer from 'reducers/investigationReducer'
import {Map, fromJS} from 'immutable'

describe('investigationReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on FETCH_INVESTIGATION_SUCCESS', () => {
    it('returns the investigation from the action', () => {
      const investigation = fromJS({id: '123ABC'})
      const action = fetchSuccess(investigation.toJS())
      expect(investigationReducer(Map(), action)).toEqualImmutable(investigation)
    })
  })
})

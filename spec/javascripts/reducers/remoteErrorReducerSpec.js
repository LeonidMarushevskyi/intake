import {Map} from 'immutable'
import {httpError} from 'actions/httpActions'
import * as matchers from 'jasmine-immutable-matchers'
import remoteErrorReducer from 'reducers/remoteErrorReducer'

describe('remoteErrorReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on HTTP_ERROR', () => {
    it('returns the error object', () => {
      const action = httpError({why: 'Did not have a plan'})
      expect(remoteErrorReducer(Map(), action)).toEqualImmutable(
        Map({why: 'Did not have a plan'})
      )
    })
  })
})

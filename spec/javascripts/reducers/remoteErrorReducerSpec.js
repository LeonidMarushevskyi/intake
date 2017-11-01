import {fromJS} from 'immutable'
import {httpError, httpSuccess} from 'actions/httpActions'
import * as matchers from 'jasmine-immutable-matchers'
import remoteErrorReducer from 'reducers/remoteErrorReducer'

describe('remoteErrorReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on httpError', () => {
    it('returns the error object', () => {
      const state = fromJS({
        '/another/path/here': {
          url: '/another/path/here',
        },
      })
      const action = httpError({
        url: '/path/to/some/where',
        status: 500,
        stuff: 'Did not have a plan',
      })
      expect(remoteErrorReducer(state, action)).toEqualImmutable(
        fromJS({
          '/another/path/here': {
            url: '/another/path/here',
          },
          '/path/to/some/where': {
            url: '/path/to/some/where',
            status: 500,
            stuff: 'Did not have a plan',
          },
        })
      )
    })
  })

  describe('on httpSuccess', () => {
    it('returns an empty object', () => {
      const state = fromJS({
        '/another/path/here': {
          url: '/another/path/here',
        },
        '/path/to/some/where': {
          url: '/path/to/some/where',
          status: 500,
          stuff: 'Did not have a plan',
        },
      })
      const action = httpSuccess({
        url: '/path/to/some/where',
        status: 200,
      })
      expect(remoteErrorReducer(state, action)).toEqualImmutable(
        fromJS({
          '/another/path/here': {
            url: '/another/path/here',
          },
        })
      )
    })
  })
})

import {fromJS} from 'immutable'
import {httpError, httpSuccess} from 'actions/httpActions'
import * as matchers from 'jasmine-immutable-matchers'
import errorsReducer from 'reducers/errorsReducer'

describe('errorsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on httpError', () => {
    it('returns the error object', () => {
      const state = fromJS({
        ACTION_TYPE: {
          stuff: 'Did not have a plan',
        },
      })
      const action = httpError(
        '/path/to/some/where',
        {
          stuff: 'Did not have a plan',
        }
      )
      expect(errorsReducer(state, action)).toEqualImmutable(
        fromJS({
          ACTION_TYPE: {
            stuff: 'Did not have a plan',
          },
          unknown: {
            '/path/to/some/where': {
              stuff: 'Did not have a plan',
            },
          },
        })
      )
    })
  })

  describe('on httpSuccess', () => {
    it('returns an empty object', () => {
      const state = fromJS({
        ACTION_TYPE: {
          stuff: 'Did not have a plan',
        },
        unknown: {
          '/path/to/some/where': {
            stuff: 'Did not have a plan',
          },
        },
      })
      const action = httpSuccess(
        '/path/to/some/where',
        {
          stuff: 'Did have a plan',
        }
      )
      expect(errorsReducer(state, action)).toEqualImmutable(
        fromJS({
          ACTION_TYPE: {
            stuff: 'Did not have a plan',
          },
          unknown: {},
        })
      )
    })
  })
})

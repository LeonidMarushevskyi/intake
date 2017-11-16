import {fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import errorsReducer from 'reducers/errorsReducer'

describe('errorsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('generic action type', () => {
    describe('on error', () => {
      it('updates error store for the type', () => {
        const state = fromJS({
          ACTION_TYPE: 'Did not have a plan',
        })
        const action = {
          payload: 'Did not have a plan',
          type: 'GENERIC_ACTION_COMPLETE',
          error: true,
        }
        expect(errorsReducer(state, action)).toEqualImmutable(
          fromJS({
            ACTION_TYPE: 'Did not have a plan',
            GENERIC_ACTION_COMPLETE: 'Did not have a plan',
          })
        )
      })
    })

    describe('on success', () => {
      it('does not fail if success and no previous errors', () => {
        const state = fromJS({})
        const action = {
          payload: 'Did have a plan',
          type: 'GENERIC_ACTION_COMPLETE',
          error: false,
        }
        expect(errorsReducer(state, action)).toEqualImmutable(
          fromJS({})
        )
      })
      it('resets the error store for the type', () => {
        const state = fromJS({
          ACTION_TYPE: 'Did not have a plan',
          GENERIC_ACTION_COMPLETE: 'Did not have a plan',
        })
        const action = {
          payload: 'Did have a plan',
          type: 'GENERIC_ACTION_COMPLETE',
          error: false,
        }
        expect(errorsReducer(state, action)).toEqualImmutable(
          fromJS({
            ACTION_TYPE: 'Did not have a plan',
          })
        )
      })
    })
  })
})

import {Map, fromJS} from 'immutable'
import {LOCATION_CHANGE} from 'react-router-redux'
import * as matchers from 'jasmine-immutable-matchers'
import routerReducer from 'reducers/routerReducer'
import {createSelectLocationState} from 'reducers/routerReducer'

describe('createSelectLocationState', () => {
  it('returns routing state as a javascript object', () => {
    const routing = {
      locationBeforeTransitions: {
        path: '/bar',
        action: 'PUSH',
      },
    }
    const state = fromJS({routing})
    const locationStateSelector = createSelectLocationState()
    expect(locationStateSelector(state)).toEqual(routing)
  })
})

describe('routerReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on LOCATION_CHANGE', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        path: '/bar',
        action: 'PUSH',
      },
    }
    const expectedState = fromJS({
      locationBeforeTransitions: {
        path: '/bar',
        action: 'PUSH',
      },
    })

    it('updates location state', () => {
      expect(routerReducer(Map(), action)).toEqualImmutable(expectedState)
    })

    it('allows initialState', () => {
      expect(routerReducer(undefined, action)).toEqualImmutable(expectedState)
    })
  })
})

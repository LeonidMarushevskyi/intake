import * as Utils from 'utils/http'
import * as actions from 'actions/screeningActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {Map} from 'immutable'
import {isFSA} from 'flux-standard-action'

describe('screeningActions', () => {
  const actionNames = Object.keys(actions)
  const actionFuncs = actionNames.filter((actionName) => (
    /* TODO: currently saveScreening is a thunk
     * which returns a promise not an action, therefore
     * saveScreening will never be FSA compliant. */
    typeof (actions[actionName]) === 'function' &&
      actionName !== 'saveScreening'
  ))
  actionFuncs.forEach((actionName) => {
    it(`${actionName} is FSA compliant`, () => {
      const action = actions[actionName]
      expect(isFSA(action())).toEqual(true)
    })
  })

  describe('.saveScreening', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    let store
    beforeEach(() => {
      store = mockStore(Map())
    })
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => (
      spyOn(Utils, 'put')
        .and
        .returnValue(Promise.resolve(screening))
    ))

    it('puts the screening to the server', () => {
      store.dispatch(actions.saveScreening(screening))
      expect(Utils.put).toHaveBeenCalledWith(
        `/api/v1/screenings/${screening.id}`, {screening}
      )
    })

    it('dispatches a updateScreeningSuccess', () => {
      const expectedActions = [
        actions.updateScreeningSuccess(screening),
      ]
      store.dispatch(actions.saveScreening(screening)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })
})

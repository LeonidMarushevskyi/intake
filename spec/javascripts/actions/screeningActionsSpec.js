import * as Utils from 'utils/http'
import {
  saveScreening,
  updateScreeningSuccess,
} from 'actions/screeningActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {Map} from 'immutable'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('screening actions', () => {
  let store
  beforeEach(() => {
    store = mockStore(Map())
  })

  describe('.saveScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => spyOn(Utils, 'put').and.returnValue(Promise.resolve(screening)))

    it('puts the screening to the server', () => {
      store.dispatch(saveScreening(screening))
      expect(Utils.put).toHaveBeenCalledWith(
        `/api/v1/screenings/${screening.id}`, {screening}
      )
    })

    it('dispatches a updateScreeningSuccess', () => {
      const expectedActions = [updateScreeningSuccess(screening)]
      store.dispatch(saveScreening(screening)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })
})

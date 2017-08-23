import {
  fetchScreeningSuccess,
  createScreeningSuccess,
  updateScreeningSuccess,
  createParticipantSuccess,
} from 'actions/screeningActions'
import {fromJS} from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    initialState = fromJS({
      screening: {},
      participants: [],
      relationships: [],
      involvements: [],
    })
    store = createStore(rootReducer)
  })

  it('has initial state', () => {
    expect(store.getState().equals(initialState)).toEqual(true)
  })

  it('handles fetch screening', () => {
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [{id: '2', legacy_id: '3', screening_id: '1'}],
    })
    const participants = screening.get('participants')
    const action = fetchScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening').equals(screening)).toEqual(true)
    expect(store.getState().get('participants').equals(participants)).toEqual(true)
  })

  it('handles create screening', () => {
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [],
    })
    const action = createScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening').equals(screening)).toEqual(true)
    expect(store.getState().get('participants').isEmpty()).toEqual(true)
  })

  describe('when a screening already exists in the store', () => {
    beforeEach(() => {
      initialState = initialState.set(
        'screening',
        fromJS({
          id: '1',
          name: 'Mock screening',
          participants: [],
        })
      )
      store = createStore(rootReducer, initialState)
    })

    it('handles update screening', () => {
      const participants = fromJS([{id: '2', legacy_id: '3', screening_id: '1'}])
      const updatedScreening = initialState.get('screening').set('participants', participants)
      const action = updateScreeningSuccess(updatedScreening.toJS())
      store.dispatch(action)
      expect(store.getState().get('screening').equals(updatedScreening)).toEqual(true)
      expect(store.getState().get('participants').equals(participants)).toEqual(true)
    })

    it('handles create participant', () => {
      const participants = fromJS([{id: '2', legacy_id: '3', screening_id: '1'}])
      const action = createParticipantSuccess(participants.get(0).toJS())
      store.dispatch(action)
      expect(store.getState().get('participants').equals(participants)).toEqual(true)
    })
  })
})

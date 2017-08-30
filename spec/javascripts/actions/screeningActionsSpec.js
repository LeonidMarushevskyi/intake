import * as Utils from 'utils/http'
import {
  createParticipant,
  createParticipantSuccess,
  createScreening,
  createScreeningSuccess,
  deleteParticipant,
  deleteParticipantSuccess,
  fetchHistoryOfInvolvements,
  fetchHistoryOfInvolvementsSuccess,
  fetchRelationshipsByScreeningId,
  fetchRelationshipsByScreeningIdSuccess,
  fetchScreening,
  fetchScreeningSuccess,
  saveParticipant,
  saveScreening,
  submitScreening,
  submitScreeningFailure,
  submitScreeningSuccess,
  updateParticipantSuccess,
  updateParticipantFailure,
  updateScreeningSuccess,
} from 'actions/screeningActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {fromJS} from 'immutable'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('screening actions', () => {
  let store
  beforeEach(() => {
    store = mockStore()
  })

  describe('.createScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => spyOn(Utils, 'post').and.returnValue(Promise.resolve(screening)))

    it('posts the screening to the server', () => {
      store.dispatch(createScreening())
      expect(Utils.post).toHaveBeenCalledWith('/api/v1/screenings', null)
    })

    it('dispatches a createScreeningSuccess', () => {
      const expectedActions = [createScreeningSuccess(screening)]
      store.dispatch(createScreening()).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.fetchScreening', () => {
    const screeningId = '1'
    const screening = {id: screeningId, name: 'mock_screening'}
    beforeEach((done) => {
      spyOn(Utils, 'get').and.returnValue(Promise.resolve(screening))
      store.dispatch(fetchScreening(screeningId)).then(() => done())
    })

    it('fetches the screening for a given screeningId', () => {
      expect(Utils.get).toHaveBeenCalledWith(`/api/v1/screenings/${screeningId}`)
    })

    it('dispatches a fetchScreeningSuccess', () => {
      expect(store.getActions()).toEqual([
        fetchScreeningSuccess(screening),
      ])
    })
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

  describe('.saveParticipant', () => {
    const participant = {
      screening_id: '1',
      legacy_id: '2',
      id: '199',
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      languages: ['English', 'Spanish'],
      ssn: 'ssn-1',
    }

    it('puts the participants to the server', () => {
      spyOn(Utils, 'put').and.returnValue(Promise.resolve(participant))
      store.dispatch(saveParticipant(participant))
      expect(Utils.put).toHaveBeenCalledWith(
        `/api/v1/participants/${participant.id}`, {participant}
      )
    })

    describe('when server responds successfully', () => {
      const screening = {id: '344'}
      beforeEach((done) => {
        spyOn(Utils, 'put')
        spyOn(Utils, 'get')
        store = mockStore(fromJS({screening: {id: '344'}}))
        Utils.put.and.returnValue(Promise.resolve(participant))
        Utils.get.and.returnValue(Promise.resolve(screening))
        store.dispatch(saveParticipant(participant)).then(() => done())
      })

      it('dispatches a updateParticipantSuccess', () => {
        expect(store.getActions()).toEqual([
          updateParticipantSuccess(participant),
          fetchScreeningSuccess(screening),
        ])
      })

      it('fetches the screening', () => {
        expect(Utils.get).toHaveBeenCalledWith('/api/v1/screenings/344')
      })
    })

    describe('when server responds unsuccessfully', () => {
      beforeEach((done) => {
        spyOn(Utils, 'put').and.returnValue(Promise.reject(participant))
        store.dispatch(saveParticipant(participant)).then(() => done())
      })

      it('dispatches a updateParticipantFailure', () => {
        expect(store.getActions()).toEqual([
          updateParticipantFailure(participant),
        ])
      })
    })
  })

  describe('.createParticipant', () => {
    const participant = {screening_id: '1', legacy_id: '2', id: null}
    beforeEach(() => spyOn(Utils, 'post').and.returnValue(Promise.resolve(participant)))

    it('posts the participant to the server', () => {
      store.dispatch(createParticipant(participant))
      expect(Utils.post).toHaveBeenCalledWith('/api/v1/participants', {participant})
    })

    it('dispatches a createParticipantSuccess', () => {
      const expectedActions = [createParticipantSuccess(participant)]
      store.dispatch(createParticipant(participant)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.deleteParticipant', () => {
    const participantId = '1'
    beforeEach(() => spyOn(Utils, 'destroy').and.returnValue(Promise.resolve()))

    it('deletes the participant on the server', () => {
      store.dispatch(deleteParticipant(participantId))
      expect(Utils.destroy).toHaveBeenCalledWith(`/api/v1/participants/${participantId}`)
    })

    it('dispatches a deleteParticipantSuccess', () => {
      const expectedActions = [deleteParticipantSuccess(participantId)]
      store.dispatch(deleteParticipant(participantId)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.fetchHistoryOfInvolvements', () => {
    beforeEach(() => spyOn(Utils, 'get').and.returnValue(Promise.resolve()))

    it('fetches the history of involvements from the server', () => {
      const screeningId = 22
      store.dispatch(fetchHistoryOfInvolvements(screeningId))
      expect(Utils.get).toHaveBeenCalledWith(
        `/api/v1/screenings/${screeningId}/history_of_involvements`
      )
    })

    it('dispatches a fetchHistoryOfInvolvementsSuccess', () => {
      const expectedActions = [fetchHistoryOfInvolvementsSuccess()]
      store.dispatch(fetchHistoryOfInvolvements()).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.submitScreening', () => {
    const screeningId = '3'
    beforeEach(() => spyOn(window, 'alert'))

    it('submits a screening to the server', () => {
      spyOn(Utils, 'post').and.returnValue(Promise.resolve())
      store.dispatch(submitScreening(screeningId))
      expect(Utils.post).toHaveBeenCalledWith(
        `/api/v1/screenings/${screeningId}/submit`,
        null
      )
    })

    describe('when server responds with success', () => {
      const referralId = '44'
      const jsonResponse = {referral_id: referralId}
      beforeEach(() => spyOn(Utils, 'post').and.returnValue(Promise.resolve(jsonResponse)))

      it('dispatches a submitScreeningSuccess', () => {
        const expectedActions = [submitScreeningSuccess(jsonResponse)]
        store.dispatch(submitScreening(screeningId)).then(() =>
          expect(store.getActions()).toEqual(expectedActions)
        )
      })

      it('displays an success alert with the referralId', () => {
        store.dispatch(submitScreening(screeningId)).then(() => {
          expect(window.alert).toHaveBeenCalledWith(`Successfully created referral ${referralId}`)
        })
      })
    })

    describe('when server responds with failure', () => {
      const jsonFailureResponse = {responseText: 'Failure response message'}
      beforeEach(() => {
        spyOn(Utils, 'post').and.returnValue(Promise.reject(jsonFailureResponse))
      })

      it('dispatches a submitScreeningFailure', () => {
        const expectedActions = [submitScreeningFailure(jsonFailureResponse)]
        store.dispatch(submitScreening(screeningId)).then(() =>
          expect(store.getActions()).toEqual(expectedActions)
        )
      })

      it('displays an response in an alert', () => {
        store.dispatch(submitScreening(screeningId)).then(() => {
          expect(window.alert).toHaveBeenCalledWith('Failure response message')
        })
      })
    })
  })

  describe('.fetchRelationshipsByScreeningId', () => {
    const screeningId = '3'

    beforeEach(() => {
      spyOn(Utils, 'get').and.returnValue(Promise.resolve())
    })

    it('fetches screening relationships from the server', () => {
      store.dispatch(fetchRelationshipsByScreeningId(screeningId))
      expect(Utils.get).toHaveBeenCalledWith(
        `/api/v1/screenings/${screeningId}/relationships`
      )
    })

    it('dispatches a fetchRelationshipsByScreeningIdSuccess', () => {
      const expectedActions = [fetchRelationshipsByScreeningIdSuccess()]
      store.dispatch(fetchRelationshipsByScreeningId(screeningId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})

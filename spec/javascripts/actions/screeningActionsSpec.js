import * as Utils from 'utils/http'
import * as screeningActions from 'actions/screeningActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('screening actions', () => {
  let store
  beforeEach(() => {
    store = mockStore()
  })

  describe('.createScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve(screening)))

    it('posts the screening to the server', () => {
      store.dispatch(screeningActions.createScreening())
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/screenings',
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a createScreeningSuccess', () => {
      const expectedActions = [screeningActions.createScreeningSuccess(screening)]
      store.dispatch(screeningActions.createScreening()).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.fetchScreening', () => {
    const screeningId = '1'
    const screening = {id: screeningId, name: 'mock_screening'}
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve(screening)))

    it('fetches the screening for a given screeningId', () => {
      store.dispatch(screeningActions.fetchScreening(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'GET',
        `/api/v1/screenings/${screeningId}`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a fetchScreeningSuccess', () => {
      const expectedActions = [screeningActions.fetchScreeningSuccess(screening)]
      store.dispatch(screeningActions.fetchScreening(screeningId)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.saveScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve(screening)))

    it('puts the screening to the server', () => {
      store.dispatch(screeningActions.saveScreening(screening))
      expect(Utils.request).toHaveBeenCalledWith(
        'PUT',
        `/api/v1/screenings/${screening.id}`,
        JSON.stringify({screening: screening}),
        {contentType: 'application/json'}
      )
    })

    it('dispatches a updateScreeningSuccess', () => {
      const expectedActions = [screeningActions.updateScreeningSuccess(screening)]
      store.dispatch(screeningActions.saveScreening(screening)).then(() =>
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
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve(participant)))

    it('puts the participants to the server', () => {
      store.dispatch(screeningActions.saveParticipant(participant))
      expect(Utils.request).toHaveBeenCalledWith(
        'PUT',
        `/api/v1/participants/${participant.id}`,
        JSON.stringify({participant: participant}),
        {contentType: 'application/json'}
      )
    })

    it('dispatches a updateParticipantSuccess', () => {
      const expectedActions = [screeningActions.updateParticipantSuccess(participant)]
      store.dispatch(screeningActions.saveParticipant(participant)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.createParticipant', () => {
    const participant = {screening_id: '1', legacy_id: '2', id: null}
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve(participant)))

    it('posts the participant to the server', () => {
      store.dispatch(screeningActions.createParticipant(participant))
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/participants',
        JSON.stringify({participant: participant}),
        {contentType: 'application/json'}
      )
    })

    it('dispatches a createParticipantSuccess', () => {
      const expectedActions = [screeningActions.createParticipantSuccess(participant)]
      store.dispatch(screeningActions.createParticipant(participant)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.deleteParticipant', () => {
    const participantId = '1'
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve()))

    it('deletes the participant on the server', () => {
      store.dispatch(screeningActions.deleteParticipant(participantId))
      expect(Utils.request).toHaveBeenCalledWith(
        'DELETE',
        `/api/v1/participants/${participantId}`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a deleteParticipantSuccess', () => {
      const expectedActions = [screeningActions.deleteParticipantSuccess(participantId)]
      store.dispatch(screeningActions.deleteParticipant(participantId)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.fetchHistoryOfInvolvements', () => {
    beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve()))

    it('fetches the history of involvements from the server', () => {
      const screeningId = 22
      store.dispatch(screeningActions.fetchHistoryOfInvolvements(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'GET',
        `/api/v1/screenings/${screeningId}/history_of_involvements`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a fetchHistoryOfInvolvementsSuccess', () => {
      const expectedActions = [screeningActions.fetchHistoryOfInvolvementsSuccess()]
      store.dispatch(screeningActions.fetchHistoryOfInvolvements()).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.submitScreening', () => {
    const screeningId = '3'
    beforeEach(() => spyOn(window, 'alert'))

    it('submits a screening to the server', () => {
      spyOn(Utils, 'request').and.returnValue(Promise.resolve())
      store.dispatch(screeningActions.submitScreening(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        `/api/v1/screenings/${screeningId}/submit`,
        null,
        {contentType: 'application/json'}
      )
    })

    describe('when server responds with success', () => {
      const referralId = '44'
      const jsonResponse = {referral_id: referralId}
      beforeEach(() => spyOn(Utils, 'request').and.returnValue(Promise.resolve(jsonResponse)))

      it('dispatches a submitScreeningSuccess', () => {
        const expectedActions = [screeningActions.submitScreeningSuccess(jsonResponse)]
        store.dispatch(screeningActions.submitScreening(screeningId)).then(() =>
          expect(store.getActions()).toEqual(expectedActions)
        )
      })

      it('displays an success alert with the referralId', () => {
        store.dispatch(screeningActions.submitScreening(screeningId)).then(() => {
          expect(window.alert).toHaveBeenCalledWith(`Successfully created referral ${referralId}`)
        })
      })
    })

    describe('when server responds with failure', () => {
      const jsonFailureResponse = {responseText: 'Failure response message'}
      beforeEach(() => {
        spyOn(Utils, 'request').and.returnValue(Promise.reject(jsonFailureResponse))
      })

      it('dispatches a submitScreeningFailure', () => {
        const expectedActions = [screeningActions.submitScreeningFailure(jsonFailureResponse)]
        store.dispatch(screeningActions.submitScreening(screeningId)).then(() =>
          expect(store.getActions()).toEqual(expectedActions)
        )
      })

      it('displays an response in an alert', () => {
        store.dispatch(screeningActions.submitScreening(screeningId)).then(() => {
          expect(window.alert).toHaveBeenCalledWith('Failure response message')
        })
      })
    })
  })

  describe('.fetchRelationshipsByScreeningId', () => {
    const screeningId = '3'

    beforeEach(() => {
      spyOn(Utils, 'request').and.returnValue(Promise.resolve())
    })

    it('fetches screening relationships from the server', () => {
      store.dispatch(screeningActions.fetchRelationshipsByScreeningId(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'GET',
        `/api/v1/screenings/${screeningId}/relationships`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a fetchRelationshipsByScreeningIdSuccess', () => {
      const expectedActions = [screeningActions.fetchRelationshipsByScreeningIdSuccess()]
      store.dispatch(screeningActions.fetchRelationshipsByScreeningId(screeningId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})

import 'babel-polyfill'
import {fromJS} from 'immutable'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  saveParticipantSaga,
  saveParticipant,
} from 'sagas/saveParticipantSaga'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {UPDATE_PERSON} from 'actions/personCardActions'
import * as screeningActions from 'actions/screeningActions'
import * as personCardActions from 'actions/personCardActions'

describe('saveParticipantSaga', () => {
  it('updates participant on UPDATE_PERSON', () => {
    const gen = saveParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(UPDATE_PERSON, saveParticipant))
  })
})

describe('saveParticipant', () => {
  const id = '123'
  const participant = {id}
  const action = personCardActions.savePerson(participant)

  it('saves and puts participant and fetches a screening', () => {
    const gen = saveParticipant(action)
    expect(gen.next().value).toEqual(
      call(Utils.put, '/api/v1/participants/123', participant)
    )
    expect(gen.next(participant).value).toEqual(
      put(personCardActions.updatePersonSuccess(participant))
    )
    expect(gen.next().value).toEqual(select(getScreeningSelector))
    const currentScreening = fromJS({id: '444'})
    expect(gen.next(currentScreening).value).toEqual(
      call(Utils.get, '/api/v1/screenings/444')
    )
    const fetchedScreening = {id: '444'}
    expect(gen.next(fetchedScreening).value).toEqual(
      put(screeningActions.fetchScreeningSuccess(fetchedScreening))
    )
  })

  it('puts errors when errors are thrown', () => {
    const gen = saveParticipant(action)
    expect(gen.next().value).toEqual(
      call(Utils.put, '/api/v1/participants/123', participant)
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.updatePersonFailure('some error'))
    )
  })
})

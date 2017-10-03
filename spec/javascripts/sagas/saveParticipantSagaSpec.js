import 'babel-polyfill'
import {fromJS} from 'immutable'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  saveParticipantSaga,
  saveParticipant,
} from 'sagas/saveParticipantSaga'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {UPDATE_PARTICIPANT} from 'actions/actionTypes'
import {
  updateParticipantSuccess,
  updateParticipantFailure,
  fetchScreeningSuccess,
} from 'actions/screeningActions'

describe('saveParticipantSaga', () => {
  it('updates participant on UPDATE_PARTICIPANT', () => {
    const gen = saveParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(UPDATE_PARTICIPANT, saveParticipant))
  })
})

describe('saveParticipant', () => {
  it('saves and puts participant and fetches a screening', () => {
    const id = '123'
    const participant = {id}
    const gen = saveParticipant({participant})
    expect(gen.next().value).toEqual(
      call(Utils.put, '/api/v1/participants/123', participant)
    )
    expect(gen.next(participant).value).toEqual(
      put(updateParticipantSuccess(participant))
    )
    expect(gen.next().value).toEqual(select(getScreeningSelector))

    const currentScreening = fromJS({id: '444'})
    expect(gen.next(currentScreening).value).toEqual(
      call(Utils.get, '/api/v1/screenings/444')
    )

    const fetchedScreening = {id: '444'}
    expect(gen.next(fetchedScreening).value).toEqual(
      put(fetchScreeningSuccess(fetchedScreening))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const id = '123'
    const participant = {id}
    const gen = saveParticipant({participant})
    expect(gen.next().value).toEqual(
      call(Utils.put, '/api/v1/participants/123', participant)
    )
    expect(gen.throw(error).value).toEqual(
      put(updateParticipantFailure('some error'))
    )
  })
})

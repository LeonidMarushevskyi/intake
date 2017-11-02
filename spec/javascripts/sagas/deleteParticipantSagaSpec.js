import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteParticipantSaga,
  deleteParticipant,
} from 'sagas/deleteParticipantSaga'
import {DELETE_PARTICIPANT} from 'actions/actionTypes'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import * as actions from 'actions/screeningActions'

describe('deleteParticipantSaga', () => {
  it('deletes participant on DELETE_PARTICIPANT', () => {
    const gen = deleteParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(DELETE_PARTICIPANT, deleteParticipant))
  })
})

describe('deleteParticipant', () => {
  const id = '123'
  const action = actions.deleteParticipant(id)

  it('deletes and puts participant, fetches a screening, and fetches relationships', () => {
    const gen = deleteParticipant(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.next().value).toEqual(
      put(actions.deleteParticipantSuccess(id))
    )
    expect(gen.next().value).toEqual(select(getScreeningIdValueSelector))
    expect(gen.next('444').value).toEqual(
      put(actions.fetchScreening('444'))
    )
    expect(gen.next('444').value).toEqual(
      put(actions.fetchRelationships('444'))
    )
    expect(gen.next('444').value).toEqual(
      put(actions.fetchHistoryOfInvolvements('444'))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = deleteParticipant(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.throw(error).value).toEqual(
      put(actions.deleteParticipantFailure('some error'))
    )
  })
})

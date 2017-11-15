import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteParticipantSaga,
  deleteParticipant,
} from 'sagas/deleteParticipantSaga'
import {DELETE_PERSON} from 'actions/personCardActions'
import {fetch as fetchAllegations} from 'actions/screeningAllegationsActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import * as personCardActions from 'actions/personCardActions'
import * as screeningActions from 'actions/screeningActions'

describe('deleteParticipantSaga', () => {
  it('deletes participant on DELETE_PERSON', () => {
    const gen = deleteParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(DELETE_PERSON, deleteParticipant))
  })
})

describe('deleteParticipant', () => {
  const id = '123'
  const action = personCardActions.deletePerson(id)

  it('deletes and puts participant, fetches a screening, and fetches relationships', () => {
    const gen = deleteParticipant(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.next().value).toEqual(
      put(personCardActions.deletePersonSuccess(id))
    )
    expect(gen.next().value).toEqual(select(getScreeningIdValueSelector))
    expect(gen.next('444').value).toEqual(
      put(fetchAllegations('444'))
    )
    expect(gen.next('444').value).toEqual(
      put(screeningActions.fetchRelationships('444'))
    )
    expect(gen.next('444').value).toEqual(
      put(screeningActions.fetchHistoryOfInvolvements('444'))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = deleteParticipant(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.deletePersonFailure('some error'))
    )
  })
})

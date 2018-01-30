import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteSnapshotPersonSaga,
  deleteSnapshotPerson,
} from 'sagas/deleteSnapshotPersonSaga'
import {DELETE_SNAPSHOT_PERSON} from 'actions/personCardActions'
import * as personCardActions from 'actions/personCardActions'

describe('deleteParticipantSaga', () => {
  it('deletes participant on DELETE_PERSON', () => {
    const gen = deleteSnapshotPersonSaga()
    expect(gen.next().value).toEqual(takeEvery(DELETE_SNAPSHOT_PERSON, deleteSnapshotPerson))
  })
})

describe('deleteParticipant', () => {
  const id = '123'
  const action = personCardActions.deleteSnapshotPerson(id)

  it('deletes and puts participant, fetches a screening, and fetches relationships', () => {
    const gen = deleteSnapshotPerson(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.next().value).toEqual(
      put(personCardActions.deletePersonSuccess(id))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = deleteSnapshotPerson(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.deletePersonFailure('some error'))
    )
  })
})


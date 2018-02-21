import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteSnapshotPersonSaga,
  deleteSnapshotPerson,
} from 'sagas/deleteSnapshotPersonSaga'
import {DELETE_SNAPSHOT_PERSON} from 'actions/personCardActions'
import * as personCardActions from 'actions/personCardActions'
import {fetchRelationships} from 'actions/relationshipsActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'

describe('deleteParticipantSaga', () => {
  it('deletes participant on DELETE_PERSON', () => {
    const gen = deleteSnapshotPersonSaga()
    expect(gen.next().value).toEqual(takeEvery(DELETE_SNAPSHOT_PERSON, deleteSnapshotPerson))
  })
})

describe('deleteParticipant', () => {
  const id = '123'
  const action = personCardActions.deleteSnapshotPerson(id)

  it('deletes and puts participant, fetches a screening, relationships, and history_of_involvements', () => {
    const gen = deleteSnapshotPerson(action)
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.next().value).toEqual(
      put(personCardActions.deletePersonSuccess(id))
    )
    expect(gen.next().value).toEqual(
      select(getSnapshotIdValueSelector)
    )
    const snapshotId = '444'
    expect(gen.next(snapshotId).value).toEqual(
      put(fetchRelationships('snapshots', snapshotId))
    )
    expect(gen.next(snapshotId).value).toEqual(
      put(fetchHistoryOfInvolvements('snapshots', snapshotId))
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


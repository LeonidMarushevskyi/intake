import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createSnapshotSaga,
  createSnapshot,
} from 'sagas/createSnapshotSaga'
import {CREATE_SNAPSHOT} from 'actions/actionTypes'
import {
  createSnapshotSuccess,
  createSnapshotFailure,
} from 'actions/snapshotActions'
import {push} from 'react-router-redux'

describe('createSnapshotSaga', () => {
  it('creates snapshot on CREATE_SNAPSHOT', () => {
    const gen = createSnapshotSaga()
    expect(gen.next().value).toEqual(takeEvery(CREATE_SNAPSHOT, createSnapshot))
  })
})

describe('createSnapshot', () => {
  it('creates and puts snapshot', () => {
    const snapshot = {id: '123'}
    const gen = createSnapshot()
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings'))
    expect(gen.next(snapshot).value).toEqual(
      put(createSnapshotSuccess(snapshot))
    )
    expect(gen.next().value).toEqual(
      put(push('/snapshot'))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = createSnapshot()
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings'))
    expect(gen.throw(error).value).toEqual(
      put(createSnapshotFailure(error))
    )
  })
})


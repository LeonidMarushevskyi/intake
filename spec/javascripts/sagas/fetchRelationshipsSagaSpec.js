import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchRelationshipsSaga,
  fetchRelationships,
} from 'sagas/fetchRelationshipsSaga'
import {FETCH_RELATIONSHIPS} from 'actions/actionTypes'
import {
  fetchRelationshipsSuccess,
  fetchRelationshipsFailure,
} from 'actions/screeningActions'

describe('fetchRelationshipsSaga', () => {
  it('fetches relationships on FETCH_RELATIONSHIPS', () => {
    const gen = fetchRelationshipsSaga()
    expect(gen.next().value).toEqual(
      takeEvery(FETCH_RELATIONSHIPS, fetchRelationships)
    )
  })
})

describe('fetchRelationships', () => {
  it('fetches and puts relationships', () => {
    const id = '123'
    const relationships = [{id: '2'}]
    const gen = fetchRelationships({id})
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/screenings/123/relationships')
    )
    expect(gen.next(relationships).value).toEqual(
      put(fetchRelationshipsSuccess(relationships))
    )
  })

  it('puts errors when errors are thrown', () => {
    const id = '123'
    const error = {responseJSON: 'some error'}
    const gen = fetchRelationships({id})
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/screenings/123/relationships')
    )
    expect(gen.throw(error).value).toEqual(
      put(fetchRelationshipsFailure('some error'))
    )
  })
})

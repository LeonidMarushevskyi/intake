import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchHistoryOfInvolvementsSaga,
  fetchHistoryOfInvolvements,
} from 'sagas/fetchHistoryOfInvolvementsSaga'
import {FETCH_HISTORY_OF_INVOLVEMENTS} from 'actions/actionTypes'
import {
  fetchHistoryOfInvolvementsSuccess,
  fetchHistoryOfInvolvementsFailure,
} from 'actions/screeningActions'

describe('fetchHistoryOfInvolvementsSaga', () => {
  it('fetches involvements on FETCH_HISTORY_OF_INVOLVEMENTS', () => {
    const gen = fetchHistoryOfInvolvementsSaga()
    expect(gen.next().value).toEqual(
      takeEvery(FETCH_HISTORY_OF_INVOLVEMENTS, fetchHistoryOfInvolvements)
    )
  })
})

describe('fetchHistoryOfInvolvements', () => {
  it('fetches and puts involvements', () => {
    const id = '123'
    const involvements = [{id: '2'}]
    const gen = fetchHistoryOfInvolvements({id})
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/screenings/123/history_of_involvements')
    )
    expect(gen.next(involvements).value).toEqual(
      put(fetchHistoryOfInvolvementsSuccess(involvements))
    )
  })

  it('puts errors when errors are thrown', () => {
    const id = '123'
    const error = {responseJSON: 'some error'}
    const gen = fetchHistoryOfInvolvements({id})
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/screenings/123/history_of_involvements')
    )
    expect(gen.throw(error).value).toEqual(
      put(fetchHistoryOfInvolvementsFailure('some error'))
    )
  })
})

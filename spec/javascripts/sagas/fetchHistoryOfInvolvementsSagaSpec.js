import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchHistoryOfInvolvementsSaga,
  fetchHistoryOfInvolvements,
} from 'sagas/fetchHistoryOfInvolvementsSaga'
import {FETCH_HISTORY_OF_INVOLVEMENTS} from 'actions/actionTypes'
import * as actions from 'actions/screeningActions'

describe('fetchHistoryOfInvolvementsSaga', () => {
  it('fetches involvements on FETCH_HISTORY_OF_INVOLVEMENTS', () => {
    const gen = fetchHistoryOfInvolvementsSaga()
    expect(gen.next().value).toEqual(
      takeEvery(FETCH_HISTORY_OF_INVOLVEMENTS, fetchHistoryOfInvolvements)
    )
  })
})

describe('fetchHistoryOfInvolvements', () => {
  const id = '123'
  const action = actions.fetchHistoryOfInvolvements(id)

  it('fetches and puts involvements', () => {
    const gen = fetchHistoryOfInvolvements(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/screenings/123/history_of_involvements')
    )
    const involvements = [{id: '2'}]
    expect(gen.next(involvements).value).toEqual(
      put(actions.fetchHistoryOfInvolvementsSuccess(involvements))
    )
  })

  it('puts errors when errors are thrown', () => {
    const gen = fetchHistoryOfInvolvements(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/screenings/123/history_of_involvements')
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(actions.fetchHistoryOfInvolvementsFailure('some error'))
    )
  })
})

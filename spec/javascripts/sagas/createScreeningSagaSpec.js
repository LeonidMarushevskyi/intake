import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createScreeningSaga,
  createScreening,
} from 'sagas/createScreeningSaga'
import {CREATE_SCREENING} from 'actions/actionTypes'
import {
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {push} from 'react-router-redux'

describe('createScreeningSaga', () => {
  it('creates screening on CREATE_SCREENING', () => {
    const gen = createScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(CREATE_SCREENING, createScreening))
  })
})

describe('createScreening', () => {
  it('creates and puts screening', () => {
    const screening = {id: '123'}
    const gen = createScreening()
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings'))
    expect(gen.next(screening).value).toEqual(
      put(createScreeningSuccess(screening))
    )
    expect(gen.next().value).toEqual(
      put(push('/screenings/123/edit'))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = createScreening()
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings'))
    expect(gen.throw(error).value).toEqual(
      put(createScreeningFailure(error))
    )
  })
})

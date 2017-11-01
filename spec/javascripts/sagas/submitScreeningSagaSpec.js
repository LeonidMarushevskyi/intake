import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {fromJS} from 'immutable'
import {post} from 'utils/http'
import {
  submitScreeningSaga,
  submitScreening,
} from 'sagas/submitScreeningSaga'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {SUBMIT_SCREENING} from 'actions/actionTypes'
import * as actions from 'actions/screeningActions'

describe('submitScreeningSaga', () => {
  it('submits screening on SUBMIT_SCREENING', () => {
    const gen = submitScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(SUBMIT_SCREENING, submitScreening))
  })
})

describe('submitScreening', () => {
  const id = 333
  const action = actions.submitScreening(id)

  it('submits and puts submit screening success', () => {
    const gen = submitScreening(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings/333/submit'))
    const response = {id: 333}
    expect(gen.next(response).value).toEqual(
      put(actions.submitScreeningSuccess(response))
    )
    expect(gen.next().value).toEqual(select(getScreeningSelector))
    const currentScreening = fromJS({referral_id: 444})
    expect(gen.next(currentScreening).value).toEqual(
      call(console.log, 'Successfully created referral 444')
    )
  })

  it('puts errors when errors are thrown', () => {
    const gen = submitScreening(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings/333/submit'))
    const error = {
      responseJSON: 'some error json',
      responseText: 'some error text',
    }
    expect(gen.throw(error).value).toEqual(
      put(actions.submitScreeningFailure('some error json'))
    )
    expect(gen.next().value).toEqual(
      call(console.log, error)
    )
  })
})

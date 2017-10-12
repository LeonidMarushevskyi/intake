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
import {
  submitScreeningSuccess,
  submitScreeningFailure,
} from 'actions/screeningActions'

describe('submitScreeningSaga', () => {
  it('submits screening on SUBMIT_SCREENING', () => {
    const gen = submitScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(SUBMIT_SCREENING, submitScreening))
  })
})

describe('submitScreening', () => {
  it('submits and puts submit screening success', () => {
    const id = 333
    const response = {id: 333}
    const currentScreening = fromJS({referral_id: 444})
    const gen = submitScreening({id})
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings/333/submit'))
    expect(gen.next(response).value).toEqual(
      put(submitScreeningSuccess(response))
    )
    expect(gen.next().value).toEqual(select(getScreeningSelector))
    expect(gen.next(currentScreening).value).toEqual(
      call(alert, 'Successfully created referral 444')
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {
      responseJSON: 'some error json',
      responseText: 'some error text',
    }
    const id = 333
    const gen = submitScreening({id})
    expect(gen.next().value).toEqual(call(post, '/api/v1/screenings/333/submit'))
    expect(gen.throw(error).value).toEqual(
      put(submitScreeningFailure('some error json'))
    )
    expect(gen.next().value).toEqual(
      call(console.log, error)
    )
  })
})

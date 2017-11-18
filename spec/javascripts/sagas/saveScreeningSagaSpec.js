import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {saveScreeningSaga, saveScreening} from 'sagas/saveScreeningSaga'
import {saveSuccess, saveFailure, save, SAVE_SCREENING} from 'actions/screeningActions'

describe('saveScreeningSaga', () => {
  it('saves screening on SAVE_SCREENING', () => {
    const gen = saveScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(SAVE_SCREENING, saveScreening))
  })
})

describe('saveScreening', () => {
  const screening = {id: 123}
  const action = save(screening)

  it('saves and puts screening', () => {
    const gen = saveScreening(action)
    expect(gen.next().value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening)
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('puts errors when errors are thrown', () => {
    const gen = saveScreening(action)
    expect(gen.next().value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening)
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(saveFailure('some error'))
    )
  })
})

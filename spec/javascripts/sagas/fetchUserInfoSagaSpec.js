// import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchUserInfoSaga, fetchUserInfo} from 'sagas/fetchUserInfoSaga'
import {FETCH_USER_INFO, fetchSuccess, fetchFailure} from 'actions/userInfoActions'

describe('fetchUserInfoSaga', () => {
  it('fetches user info on FETCH_USER_INFO', () => {
    const userInfoSagaGenerator = fetchUserInfoSaga()
    expect(userInfoSagaGenerator.next().value).toEqual(takeEvery(FETCH_USER_INFO, fetchUserInfo))
  })
})

describe('fetchUserInfo', () => {
  it('finds some error during the process', () => {
    const error = 'Something went wrong'
    const userInfoGenerator = fetchUserInfo()
    expect(userInfoGenerator.next().value).toEqual(call(get, '/api/v1/user_info'))
    expect(userInfoGenerator.throw(error).value).toEqual(put(fetchFailure('Something went wrong')))
  })

  it('fetches user info successfully', () => {
    const userInfo = {firstName: 'Arya', lastName: 'Stark', staffid: 'XWz'}
    const userInfoGenerator = fetchUserInfo()
    expect(userInfoGenerator.next().value).toEqual(call(get, '/api/v1/user_info'))
    expect(userInfoGenerator.next(userInfo).value).toEqual(put(fetchSuccess(userInfo)))
  })
})

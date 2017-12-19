import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {delay} from 'redux-saga'
import {fetchPeopleSearchSaga, fetchPeopleSearch} from 'sagas/fetchPeopleSearchSaga'
import {PEOPLE_SEARCH_FETCH, search, fetchSuccess, fetchFailure} from 'actions/peopleSearchActions'

describe('fetchPeopleSearchSaga', () => {
  it('fetches user info on PEOPLE_SEARCH_FETCH', () => {
    const peopleSeachSagaGenerator = fetchPeopleSearchSaga()
    expect(peopleSeachSagaGenerator.next().value).toEqual(takeLatest(PEOPLE_SEARCH_FETCH, fetchPeopleSearch))
  })
})

describe('fetchPeopleSearch', () => {
  const action = search('hello')

  it('finds some error during the process', () => {
    const error = 'Something went wrong'
    const peopleSeachGenerator = fetchPeopleSearch(action)
    expect(peopleSeachGenerator.next().value).toEqual(call(delay, 400))
    expect(peopleSeachGenerator.next().value).toEqual(call(get, '/api/v1/people/search', {search_term: 'hello'}))
    expect(peopleSeachGenerator.throw(error).value).toEqual(put(fetchFailure('Something went wrong')))
  })

  it('fetches user info successfully', () => {
    const searchResults = {
      hits: {
        total: 0,
        hits: [],
      },
    }
    const peopleSeachGenerator = fetchPeopleSearch(action)
    expect(peopleSeachGenerator.next().value).toEqual(call(delay, 400))
    expect(peopleSeachGenerator.next().value).toEqual(call(get, '/api/v1/people/search', {search_term: 'hello'}))
    expect(peopleSeachGenerator.next(searchResults).value).toEqual(put(fetchSuccess(searchResults)))
  })
})

import {
  clear,
  fetchFailure,
  fetchSuccess,
  loadMoreResults,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
  search,
  setSearchTerm,
} from 'actions/peopleSearchActions'
import {isFSA} from 'flux-standard-action'

describe('peopleSearchActions', () => {
  it('fetchSuccess is FSA compliant', () => {
    const action = fetchSuccess({
      hits: {
        total: 0,
        hits: [],
      },
    })
    expect(isFSA(action)).toEqual(true)
  })

  it('fetchFailure is FSA compliant', () => {
    const action = fetchFailure({})
    expect(isFSA(action)).toEqual(true)
  })

  it('search is FSA compliant', () => {
    const action = search('test')
    expect(isFSA(action)).toEqual(true)
  })

  it('loadMoreResults is FSA compliant', () => {
    const action = loadMoreResults()
    expect(isFSA(action)).toEqual(true)
  })

  it('loadMoreResultsSuccess is FSA compliant', () => {
    const action = loadMoreResultsSuccess({
      hits: {
        total: 0,
        hits: [],
      },
    })
    expect(isFSA(action)).toEqual(true)
  })

  it('loadMoreResultsFailure is FSA compliant', () => {
    const action = loadMoreResultsFailure({})
    expect(isFSA(action)).toEqual(true)
  })

  it('clear is FSA compliant', () => {
    const action = clear()
    expect(isFSA(action)).toEqual(true)
  })

  it('setSearchTerm is FSA compliant', () => {
    const action = setSearchTerm('hello')
    expect(isFSA(action)).toEqual(true)
  })
})

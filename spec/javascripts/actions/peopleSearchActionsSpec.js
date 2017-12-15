import {
  search,
  fetchSuccess,
  fetchFailure,
  clear,
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

  it('clear is FSA compliant', () => {
    const action = clear()
    expect(isFSA(action)).toEqual(true)
  })

  it('setSearchTerm is FSA compliant', () => {
    const action = setSearchTerm('hello')
    expect(isFSA(action)).toEqual(true)
  })
})

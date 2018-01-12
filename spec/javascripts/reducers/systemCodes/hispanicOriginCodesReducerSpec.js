import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import hispanicOriginCodeReducer from 'reducers/systemCodes/hispanicOriginCodesReducer'
import {fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('hispanicOriginCodeReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  it('returns the system codes for hispanic origin code category', () => {
    const action = fetchSuccess([
      {code: '123', value: 'Y', category: 'hispanic_origin_code'},
    ])

    expect(hispanicOriginCodeReducer(List(), action)).toEqualImmutable(fromJS([
      {code: '123', value: 'Y', category: 'hispanic_origin_code'},
    ]))
  })

  it('returns the last state on failure', () => {
    const action = fetchFailure()
    expect(hispanicOriginCodeReducer(List(), action)).toEqualImmutable(List())
  })
})

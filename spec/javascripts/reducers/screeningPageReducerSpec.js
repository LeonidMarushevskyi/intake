import * as matchers from 'jasmine-immutable-matchers'
import {setPageMode} from 'actions/screeningPageActions'
import screeningPageReducer from 'reducers/screeningPageReducer'
import {Map} from 'immutable'

describe('screeningPageReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_SCREENING_PAGE_MODE', () => {
    it('returns the screening page with the updated mode', () => {
      const action = setPageMode('edit')
      expect(screeningPageReducer(Map(), action)).toEqualImmutable(
        Map({mode: 'edit'})
      )
    })
  })
})

import * as matchers from 'jasmine-immutable-matchers'
import {setPageMode, setPersonCardMode} from 'actions/screeningPageActions'
import screeningPageReducer from 'reducers/screeningPageReducer'
import {Map, fromJS} from 'immutable'

describe('screeningPageReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_SCREENING_PAGE_MODE', () => {
    it('returns the screening page with the updated mode', () => {
      const action = setPageMode('edit')
      expect(screeningPageReducer(Map(), action)).toEqualImmutable(
        fromJS({mode: 'edit'})
      )
    })
  })
  describe('on SET_PERSON_CARD_MODE', () => {
    it('returns the screening page with the updated person card mode', () => {
      const personId = 'some-arbitrary-id'
      const action = setPersonCardMode(personId, 'show')
      const initialState = fromJS({mode: 'edit'})
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(
        fromJS({
          mode: 'edit',
          peopleCards: {'some-arbitrary-id': 'show'},
        })
      )
    })
  })
})

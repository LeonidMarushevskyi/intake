import * as matchers from 'jasmine-immutable-matchers'
import {setPageMode, setPersonCardMode} from 'actions/screeningPageActions'
import screeningPageReducer from 'reducers/screeningPageReducer'
import {createPersonSuccess, createPersonFailure} from 'actions/personCardActions'
import {Map, fromJS} from 'immutable'

describe('screeningPageReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_SCREENING_PAGE_MODE', () => {
    const initialState = Map()

    it('returns the screening page with the updated mode', () => {
      const action = setPageMode('edit')
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(
        fromJS({mode: 'edit'})
      )
    })
  })
  describe('on SET_PERSON_CARD_MODE', () => {
    const initialState = fromJS({mode: 'edit'})

    it('returns the screening page with the updated person card mode', () => {
      const personId = 'some-arbitrary-id'
      const action = setPersonCardMode(personId, 'show')
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(
        fromJS({
          mode: 'edit',
          peopleCards: {'some-arbitrary-id': 'show'},
        })
      )
    })
  })
  describe('on CREATE_PERSON_COMPLETE', () => {
    const initialState = fromJS({mode: 'show'})
    const newPerson = {id: 'some-arbitrary-id'}

    describe('when there is no error', () => {
      it('returns the screening page with the created person card in edit mode', () => {
        const action = createPersonSuccess(newPerson)
        expect(screeningPageReducer(initialState, action)).toEqualImmutable(
          fromJS({
            mode: 'show',
            peopleCards: {'some-arbitrary-id': 'edit'},
          })
        )
      })
    })
    describe('when there is an error', () => {
      it('returns the screening page untouched', () => {
        const action = createPersonFailure()
        expect(screeningPageReducer(initialState, action)).toEqualImmutable(
          initialState
        )
      })
    })
  })
})

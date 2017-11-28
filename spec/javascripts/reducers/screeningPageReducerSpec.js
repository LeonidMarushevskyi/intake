import * as IntakeConfig from 'common/config'
import * as matchers from 'jasmine-immutable-matchers'
import screeningPageReducer from 'reducers/screeningPageReducer'
import {Map, fromJS} from 'immutable'
import {createPersonSuccess, createPersonFailure} from 'actions/personCardActions'
import {setPageMode, setPersonCardMode} from 'actions/screeningPageActions'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'

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
  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('when an error occurs returns current screening page', () => {
      const initialState = fromJS({mode: 'show'})
      const action = fetchScreeningFailure()
      expect(screeningPageReducer(initialState, action)).toEqualImmutable(initialState)
    })
    describe('on successful fetching of a screening', () => {
      const participants = [
        {id: 'participant_id_one'},
        {id: 'participant_id_two'},
      ]
      const screening = {participants}
      const action = fetchScreeningSuccess(screening)
      describe("when screening page mode is 'show'", () => {
        const initialState = fromJS({mode: 'show'})
        it("returns screening page with each persons mode set to 'show'", () => {
          expect(screeningPageReducer(initialState, action)).toEqualImmutable(
            fromJS({
              mode: 'show',
              peopleCards: {
                participant_id_one: 'show',
                participant_id_two: 'show',
              },
            })
          )
        })
      })
      describe("when screening page mode is 'edit'", () => {
        const initialState = fromJS({mode: 'edit'})
        it("returns screening page with each persons mode set to 'edit'", () => {
          expect(screeningPageReducer(initialState, action)).toEqualImmutable(
            fromJS({
              mode: 'edit',
              peopleCards: {
                participant_id_one: 'edit',
                participant_id_two: 'edit',
              },
            })
          )
        })
      })
    })
  })
  describe('on CREATE_PERSON_COMPLETE', () => {
    const initialState = fromJS({mode: 'show'})
    const newPerson = {id: 'some-arbitrary-id'}

    describe('when there is no error', () => {
      const action = createPersonSuccess(newPerson)

      describe('when release two is not active', () => {
        beforeEach(() => spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false))

        it('returns the screening page with the created person card in edit mode', () => {
          expect(screeningPageReducer(initialState, action)).toEqualImmutable(
            fromJS({
              mode: 'show',
              peopleCards: {'some-arbitrary-id': 'edit'},
            })
          )
        })
      })
      describe('when release two is active', () => {
        beforeEach(() => spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(true))

        it('returns the screening page with the created person card in show mode', () => {
          expect(screeningPageReducer(initialState, action)).toEqualImmutable(
            fromJS({
              mode: 'show',
              peopleCards: {'some-arbitrary-id': 'show'},
            })
          )
        })
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

import {List, fromJS} from 'immutable'
import {
  resetAllegations,
  setAllegationTypes,
} from 'actions/allegationsFormActions'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import * as matchers from 'jasmine-immutable-matchers'
import allegationsFormReducer from 'reducers/allegationsFormReducer'

describe('narrativeFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the narrative form', () => {
      const allegations = [{id: '123', victim_id: '1', perpetrator_id: '2', allegation_types: ['General neglect']}]
      const action = fetchScreeningSuccess({allegations})
      expect(allegationsFormReducer(List(), action)).toEqualImmutable(
        fromJS([
          {
            id: '123',
            victimId: '1',
            perpetratorId: '2',
            allegationTypes: ['General neglect'],
          },
        ])
      )
    })

    it('returns the last state on failure', () => {
      const action = fetchScreeningFailure()
      expect(allegationsFormReducer(List(), action))
        .toEqualImmutable(List())
    })
  })

  describe('on SET_ALLEGATION_TYPES', () => {
    it('adds allegations to the form store if they do not currently exist', () => {
      const action = setAllegationTypes({
        victimId: '1',
        perpetratorId: '2',
        allegationTypes: ['General neglect'],
      })
      const state = List()
      expect(allegationsFormReducer(state, action)).toEqualImmutable(
        fromJS([
          {
            id: null,
            victimId: '1',
            perpetratorId: '2',
            allegationTypes: ['General neglect'],
          },
        ])
      )
    })
  })

  describe('on RESET_ALLEGATIONS_TYPES', () => {
    it('resets the store to the allegations passed to reset', () => {
      const action = resetAllegations({allegations: []})
      const allegations = [{victim_id: '1', perpetrator_id: '2', allegation_types: ['General neglect']}]
      const state = fromJS({allegationsForm: allegations})
      expect(allegationsFormReducer(state, action)).toEqualImmutable(List())
    })
  })
})

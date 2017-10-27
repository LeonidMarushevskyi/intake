import {fromJS, List} from 'immutable'
import {
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
} from 'selectors/screening/allegationShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'
import * as AllegationsHelper from 'utils/allegationsHelper'

describe('allegationShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getFormattedAllegations', () => {
    it('returns an empty list when no allegations are present', () => {
      const state = fromJS({screening: {}})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(List())
    })

    it('when allegations are present, returns a list of formatted values', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith'},
        {id: '2', first_name: 'Jane', last_name: 'Doe'},
        {id: '3', first_name: 'Sally', last_name: 'Smith'},
        {id: '4', first_name: 'John', last_name: 'Doe'},
      ]
      const allegations = [
        {
          victim_id: '1',
          perpetrator_id: '2',
          allegation_types: ['General neglect', 'Severe neglect'],
        },
        {
          victim_id: '3',
          perpetrator_id: '4',
          allegation_types: ['Physical abuse'],
        },
      ]
      const state = fromJS({screening: {participants, allegations}})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([
        {victim: 'John Smith', perpetrator: 'Jane Doe', type: 'General neglect'},
        {victim: 'John Smith', perpetrator: 'Jane Doe', type: 'Severe neglect'},
        {victim: 'Sally Smith', perpetrator: 'John Doe', type: 'Physical abuse'},
      ]))
    })
  })

  describe('getAllegationsRequiredValueSelector', () => {
    it('returns false when the screening decision is not promote_to_referral', () => {
      const state = fromJS({screening: {screening_decision: 'blah'}})
      expect(getAllegationsRequiredValueSelector(state)).toEqual(false)
    })

    it('returns true when screening decision is promote_to_referral', () => {
      const state = fromJS({screening: {screening_decision: 'promote_to_referral'}})
      expect(getAllegationsRequiredValueSelector(state)).toEqual(true)
    })
  })

  describe('getAllegationsAlertErrorMessageSelector', () => {
    describe('when allegations are not required', () => {
      it('returns undefined when allegations are not required', () => {
        const state = fromJS({screening: {screening_decision: 'blah'}})
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual(undefined)
      })

      it('returns a message when at risk is required and not present', () => {
        const state = fromJS({screening: {screening_decision: 'blah'}})
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(false)
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual('Any allegations of Sibling at Risk must be accompanied by another allegation.')
      })
    })

    describe('when allegations are required', () => {
      const screening_decision = 'promote_to_referral'

      it('returns undefined when allegation are required but valid allegations exist', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const allegations = [{
          id: 1,
          victim_id: '123abc',
          perpetrator_id: 'cba321',
          allegation_types: ['Physical abuse'],
        }]
        const state = fromJS({screening: {screening_decision, allegations}})
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual(undefined)
      })

      it('returns a message when allegations are required and no allegations are valid', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const allegations = [{
          id: 1,
          victim_id: '123abc',
          perpetrator_id: 'cba321',
          allegation_types: [],
        }]
        const state = fromJS({screening: {screening_decision, allegations}})
        expect(getAllegationsAlertErrorMessageSelector(state)).toContain('must include at least one allegation.')
      })

      it('returns a message when at risk is only allegation', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(false)
        const allegations = [{
          id: 1,
          victim_id: '123abc',
          perpetrator_id: 'cba321',
          allegation_types: ['At risk, sibling abused'],
        }]
        const state = fromJS({screening: {screening_decision, allegations}})
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual('Any allegations of Sibling at Risk must be accompanied by another allegation.')
      })
    })
  })
})

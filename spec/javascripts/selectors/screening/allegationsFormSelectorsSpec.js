import {fromJS} from 'immutable'
import {
  getScreeningWithAllegationsEditsSelector,
  getFormattedAllegationsSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsAlertErrorMessageSelector,
  getSortedVictimsSelector,
  getSortedPerpetratorsSelector,
} from 'selectors/screening/allegationsFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'
import * as AllegationsHelper from 'utils/allegationsHelper'

describe('allegationsFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getScreeningWithAllegationsEdits', () => {
    it('combines the allegations from the form state with the saved screening', () => {
      const allegationsForm = [
        {id: '123', victimId: '1', perpetratorId: '2', allegationTypes: ['General neglect']},
      ]
      const screening = {id: 'ABCDEF', screening_decision: 'promote_to_referral', allegations: [
        {id: '456', victim_id: '3', perpetrator_id: '4', allegation_types: ['General neglect']},
      ]}
      const state = fromJS({allegationsForm, screening})
      expect(getScreeningWithAllegationsEditsSelector(state)).toEqualImmutable(fromJS({
        id: 'ABCDEF',
        screening_decision: 'promote_to_referral',
        allegations: [{
          id: '123',
          victim_id: '1',
          perpetrator_id: '2',
          allegation_types: ['General neglect'],
          screening_id: 'ABCDEF',
        }],
      }))
    })

    it('only saves allegations that have allegationTypes', () => {
      const allegationsForm = [
        {id: '123', victimId: '1', perpetratorId: '2', allegationTypes: ['General neglect']},
        {id: '456', victimId: '3', perpetratorId: '4', allegationTypes: ['']},
        {id: '789', victimId: '3', perpetratorId: '4', allegationTypes: []},
      ]
      const screening = {id: 'ABCDEF', screening_decision: 'promote_to_referral', allegations: [
        {id: '012', victim_id: '3', perpetrator_id: '4', allegation_types: ['General neglect']},
      ]}
      const state = fromJS({allegationsForm, screening})
      expect(getScreeningWithAllegationsEditsSelector(state)).toEqualImmutable(fromJS({
        id: 'ABCDEF',
        screening_decision: 'promote_to_referral',
        allegations: [{
          id: '123',
          victim_id: '1',
          perpetrator_id: '2',
          allegation_types: ['General neglect'],
          screening_id: 'ABCDEF',
        }],
      }))
    })
  })

  describe('getFormattedAllegations', () => {
    it('combines victims and perpetrators from the store', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith', roles: ['Victim']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Perpetrator']},
      ]
      const state = fromJS({participants})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([{
        victimName: 'John Smith',
        victimId: '1',
        perpetratorName: 'Jane Doe',
        perpetratorId: '2',
        allegationTypes: [],
      }]))
    })

    it('only includes the victim name in the first allegation for that victim', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Aaron', roles: ['Victim', 'Perpetrator']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Victim', 'Perpetrator']},
        {id: '3', first_name: 'Bob', last_name: 'Smith', roles: ['Perpetrator']},
      ]
      const state = fromJS({participants})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([
        {
          victimName: 'John Aaron',
          victimId: '1',
          perpetratorName: 'Jane Doe',
          perpetratorId: '2',
          allegationTypes: [],
        }, {
          victimName: '',
          victimId: '1',
          perpetratorName: 'Bob Smith',
          perpetratorId: '3',
          allegationTypes: [],
        }, {
          victimName: 'Jane Doe',
          victimId: '2',
          perpetratorName: 'John Aaron',
          perpetratorId: '1',
          allegationTypes: [],
        }, {
          victimName: '',
          victimId: '2',
          perpetratorName: 'Bob Smith',
          perpetratorId: '3',
          allegationTypes: [],
        },
      ]))
    })

    it('includes any allegationsTypes from the store for that victim and perpetrator', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith', roles: ['Victim']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Perpetrator']},
      ]
      const allegationsForm = [
        {victimId: '1', perpetratorId: '2', allegationTypes: ['General neglect']},
      ]
      const state = fromJS({participants, allegationsForm})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([{
        victimName: 'John Smith',
        victimId: '1',
        perpetratorName: 'Jane Doe',
        perpetratorId: '2',
        allegationTypes: ['General neglect'],
      }]))
    })

    it('does not build allegations where a victim and perpetrator are the same person', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith', roles: ['Victim', 'Perpetrator']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Perpetrator']},
        {id: '3', first_name: 'Bob', last_name: 'Smith', roles: ['Perpetrator']},
      ]
      const state = fromJS({participants})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([
        {
          victimName: 'John Smith',
          victimId: '1',
          perpetratorName: 'Jane Doe',
          perpetratorId: '2',
          allegationTypes: [],
        }, {
          victimName: '',
          victimId: '1',
          perpetratorName: 'Bob Smith',
          perpetratorId: '3',
          allegationTypes: [],
        },
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
        const state = fromJS({screening: {screening_decision: 'foo'}})
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(false)
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual('Any allegations of Sibling at Risk must be accompanied by another allegation.')
      })
    })

    describe('when allegations are required', () => {
      const screening_decision = 'promote_to_referral'

      it('returns undefined when allegation are required but valid allegations exist', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const allegationsForm = [{
          id: 1,
          victimId: '123abc',
          perpetratorId: 'cba321',
          allegationTypes: ['Physical abuse'],
        }]
        const state = fromJS({allegationsForm, screening: {screening_decision}})
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual(undefined)
      })

      it('returns a message when allegations are required and no allegations are valid', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const allegationsForm = [{
          id: 1,
          victimId: '123abc',
          perpetratorId: 'cba321',
          allegationTypes: [''],
        }]
        const state = fromJS({allegationsForm, screening: {screening_decision}})
        expect(getAllegationsAlertErrorMessageSelector(state)).toContain('must include at least one allegation.')
      })

      it('returns a message when at risk is only allegation', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(false)
        const allegationsForm = [{
          id: 1,
          victimId: '123abc',
          perpetratorId: 'cba321',
          allegationTypes: ['At risk, sibling abused'],
        }]
        const state = fromJS({allegationsForm, screening: {screening_decision}})
        expect(getAllegationsAlertErrorMessageSelector(state)).toEqual('Any allegations of Sibling at Risk must be accompanied by another allegation.')
      })
    })
  })

  describe('getSortedVictimsSelector', () => {
    it('sorts victims based on their birth date', () => {
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Victim']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts victims with birth dates ahead of victims without birth dates', () => {
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Victim']}
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Victim']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts victims with the same birth date based on last name', () => {
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Victim']}
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}

      const state = fromJS({participants: [cyril, archer]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([archer, cyril]))
    })

    it('sorts victims with the same birth date when one victim has no last name', () => {
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Victim']}
      const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Victim']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts victims with the same birth date when both victims have no last name', () => {
      const cyril = {id: '4', first_name: 'Cyril', date_of_birth: '2005-01-01', roles: ['Victim']}
      const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Victim']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts victims with the same birth date and last name based on first name', () => {
      const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}

      const state = fromJS({participants: [archer, malory]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([malory, archer]))
    })

    it('sorts victims with the same birth date and last name based when one victim has no first name', () => {
      const malory = {id: '2', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}

      const state = fromJS({participants: [malory, archer]})
      expect(getSortedVictimsSelector(state)).toEqualImmutable(fromJS([archer, malory]))
    })
  })

  describe('getSortedPerpetratorsSelector', () => {
    it('sorts perpetrators based on their birth date', () => {
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts perpetrators with birth dates ahead of perpetrators without birth dates', () => {
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Perpetrator']}
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts perpetrators with the same birth date based on last name', () => {
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [cyril, archer]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([archer, cyril]))
    })

    it('sorts perpetrators with the same birth date when one perpetrator has no last name', () => {
      const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
      const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts perpetrators with the same birth date when both perpetrators have no last name', () => {
      const cyril = {id: '4', first_name: 'Cyril', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
      const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [archer, cyril]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([cyril, archer]))
    })

    it('sorts perpetrators with the same birth date and last name based on first name', () => {
      const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [archer, malory]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([malory, archer]))
    })

    it('sorts perpetrators with the same birth date and last name based when one perpetrator has no first name', () => {
      const malory = {id: '2', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
      const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

      const state = fromJS({participants: [malory, archer]})
      expect(getSortedPerpetratorsSelector(state)).toEqualImmutable(fromJS([archer, malory]))
    })
  })
})

import * as AllegationsHelper from 'utils/allegationsHelper'
import Immutable from 'immutable'

describe('hasAtRiskAllegation', () => {
  it('returns true when allegation has "At risk, sibling abused" as an allegation type', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victimId: '123abc',
      perpetratorId: 'cba321',
      allegationTypes: ['At risk, sibling abused', 'General neglect'],
    })
    expect(AllegationsHelper.hasAtRiskAllegation(allegation)).toBe(true)
  })

  it('returns false when allegation DOES NOT have "At risk, sibling abused" as an allegation type', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victimId: '123abc',
      perpetratorId: 'cba321',
      allegationTypes: ['Physical abuse', 'General neglect'],
    })
    expect(AllegationsHelper.hasAtRiskAllegation(allegation)).toBe(false)
  })
})

describe('hasNotAtRiskableAllegation', () => {
  it('returns true when allegation has more than one of the not at riskable allegation types', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victim: {
        first_name: 'sandy',
        last_name: 'smith',
      },
      perpetrator: {
        first_name: 'bob',
        last_name: 'smith',
      },
      allegationTypes: ['Physical abuse', 'General neglect'],
    })
    expect(AllegationsHelper.hasAtRiskableAllegation(allegation)).toBe(true)
  })

  it('returns true when allegation has more than one of any allegation types', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victim: {
        first_name: 'sandy',
        last_name: 'smith',
      },
      perpetrator: {
        first_name: 'bob',
        last_name: 'smith',
      },
      allegationTypes: ['Physical abuse', 'General neglect', 'At risk, sibling abused', 'Exploitation'],
    })
    expect(AllegationsHelper.hasAtRiskableAllegation(allegation)).toBe(true)
  })

  it('returns true when allegation has one of the allegation types that removes at risk error', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victim: {
        first_name: 'sandy',
        last_name: 'smith',
      },
      perpetrator: {
        first_name: 'bob',
        last_name: 'smith',
      },
      allegationTypes: ['Physical abuse'],
    })
    expect(AllegationsHelper.hasAtRiskableAllegation(allegation)).toBe(true)
  })

  it('returns false when allegation has no allegation types', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victim: {
        first_name: 'sandy',
        last_name: 'smith',
      },
      perpetrator: {
        first_name: 'bob',
        last_name: 'smith',
      },
      allegationTypes: [],
    })
    expect(AllegationsHelper.hasAtRiskableAllegation(allegation)).toBe(false)
  })

  it('returns false when allegation has only the not at riskable allegation types', () => {
    const allegation = Immutable.fromJS({
      id: 1,
      victim: {
        first_name: 'sandy',
        last_name: 'smith',
      },
      perpetrator: {
        first_name: 'bob',
        last_name: 'smith',
      },
      allegationTypes: ['At risk, sibling abused'],
    })
    expect(AllegationsHelper.hasAtRiskableAllegation(allegation)).toBe(false)
  })
})

describe('findComplementaryAllegationsForAtRisk', () => {
  it('returns empty list of allegations if same perp, different vic, but not riskable allegation', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused'],
      },
      {
        id: null,
        victimId: '124abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused'],
      },
      {
        id: 2,
        victimId: '123abc',
        perpetratorId: 'cba322',
        allegationTypes: ['Exploitation'],
      },
    ])
    const actual_allegations = AllegationsHelper.findComplementaryAllegationsForAtRisk(allegations.first(), allegations.rest())
    expect(actual_allegations.toJS()).toEqual([])
    expect(Immutable.is(actual_allegations, Immutable.List())).toEqual(true)
  })

  it('returns empty list of allegations for if no match on perp or all same victim', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused', 'General neglect'],
      },
      {
        id: null,
        victimId: '124abc',
        perpetratorId: 'cba322',
        allegationTypes: ['Physical abuse'],
      },
      {
        id: 2,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['Exploitation'],
      },
    ])
    const actual_allegations = AllegationsHelper.findComplementaryAllegationsForAtRisk(allegations.first(), allegations.rest())
    expect(actual_allegations.toJS()).toEqual([])
    expect(Immutable.is(actual_allegations, Immutable.List())).toEqual(true)
  })

  it('returns list of other allegations for same perp different victim', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused'],
      },
      {
        id: null,
        victimId: '124abc',
        perpetratorId: 'cba321',
        allegationTypes: ['Physical abuse'],
      },
      {
        id: 2,
        victimId: '123abc',
        perpetratorId: 'cba322',
        allegationTypes: ['Exploitation'],
      },
    ])
    const expected_allegations = Immutable.fromJS([
      allegations.get(1),
    ])
    const actual_allegations = AllegationsHelper.findComplementaryAllegationsForAtRisk(allegations.first(), allegations.rest())
    expect(actual_allegations.toJS()).toEqual(expected_allegations.toJS())
    expect(Immutable.is(actual_allegations, expected_allegations)).toEqual(true)
  })

  it('returns empty list when no other allegations exist', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused', 'General neglect'],
      },
    ])
    const actual_allegations = AllegationsHelper.findComplementaryAllegationsForAtRisk(allegations.first(), allegations.rest())
    expect(actual_allegations.toJS()).toEqual([])
    expect(Immutable.is(actual_allegations, Immutable.List())).toEqual(true)
  })
})

describe('siblingAtRiskHasRequiredComplementaryAllegations', () => {
  it('returns true when allegation has two types', () => {
    const allegations = Immutable.fromJS([{
      id: 1,
      victimId: '123abc',
      perpetratorId: 'cba321',
      allegationTypes: ['Physical abuse', 'At risk, sibling abused'],
    }])
    expect(AllegationsHelper.siblingAtRiskHasRequiredComplementaryAllegations(allegations)).toBe(false)
  })

  it('returns true when all have at risk but only one has an other allegation type', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['Physical abuse', 'At risk, sibling abused'],
      },
      {
        id: 2,
        victimId: '122abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused'],
      },
    ])
    expect(AllegationsHelper.siblingAtRiskHasRequiredComplementaryAllegations(allegations)).toBe(false)
  })

  it('returns false with two allegations that have two types', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['General neglect', 'At risk, sibling abused'],
      },
      {
        id: 2,
        victimId: '122abc',
        perpetratorId: 'cba321',
        allegationTypes: ['Physical abuse', 'At risk, sibling abused'],
      },
    ])
    expect(AllegationsHelper.siblingAtRiskHasRequiredComplementaryAllegations(allegations)).toBe(true)
  })

  it('returns false when another allegation with a non at risk type exists', () => {
    const allegations = Immutable.fromJS([
      {
        id: 1,
        victimId: '123abc',
        perpetratorId: 'cba321',
        allegationTypes: ['At risk, sibling abused'],
      },
      {
        id: 2,
        victimId: '122abc',
        perpetratorId: 'cba321',
        allegationTypes: ['Physical abuse'],
      },
    ])
    expect(AllegationsHelper.siblingAtRiskHasRequiredComplementaryAllegations(allegations)).toBe(true)
  })

  it('returns true when no other allegations present', () => {
    const allegations = Immutable.fromJS([{
      id: 1,
      victimId: '123abc',
      perpetratorId: 'cba321',
      allegationTypes: ['At risk, sibling abused'],
    }])
    expect(AllegationsHelper.siblingAtRiskHasRequiredComplementaryAllegations(allegations)).toBe(false)
  })
})

describe('areCrossReportsRequired', () => {
  it('does not explode if allegations do not exist', () => {
    const result = AllegationsHelper.areCrossReportsRequired()
    expect(result).toEqual(false)
  })

  it('returns true if allegations include an allegation that require cross reports', () => {
    const allegationsRequiringReports = [
      'Severe neglect',
      'Physical abuse',
      'Sexual abuse',
      'Emotional abuse',
      'Exploitation',
    ]
    allegationsRequiringReports.forEach((allegation) => {
      const allegations = Immutable.fromJS([
        {allegationTypes: [allegation]},
      ])

      const result = AllegationsHelper.areCrossReportsRequired(allegations)
      expect(result).toEqual(true)
    })
  })

  it('returns false if no allegations require cross reports', () => {
    const allegationsNotRequiringReports = [
      'Caretaker absent/incapacity',
      'General neglect',
      'At risk, sibling abused',
    ]
    allegationsNotRequiringReports.forEach((allegation) => {
      const allegations = Immutable.fromJS([
        {allegationTypes: [allegation]},
      ])

      const result = AllegationsHelper.areCrossReportsRequired(allegations)
      expect(result).toEqual(false)
    })
  })

  it('returns true if only 1 of multiple allegations requires cross reports', () => {
    const allegations = Immutable.fromJS([
      {allegationTypes: ['General neglect', 'Severe neglect']},
    ])

    const result = AllegationsHelper.areCrossReportsRequired(allegations)
    expect(result).toEqual(true)
  })
})

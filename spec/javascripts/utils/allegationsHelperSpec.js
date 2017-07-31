import * as AllegationsHelper from 'utils/allegationsHelper'
import Immutable from 'immutable'

describe('sortedAllegationsList', () => {
  const screeningId = '9'
  const allegations = Immutable.List()

  it('sorts victims based on their birth date', () => {
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([archer, malory, cyril])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('sorts victims with birth dates ahead of victims without birth dates', () => {
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Victim']}
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([archer, malory, cyril])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('sorts victims with the same birth date based on last name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Victim']}
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([malory, cyril, archer])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('sorts victims with the same birth date when one victim has no last name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Victim']}
    const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([malory, cyril, archer])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('sorts victims with the same birth date when both victims have no last name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', date_of_birth: '2005-01-01', roles: ['Victim']}
    const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([malory, cyril, archer])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('sorts victims with the same birth date and last name based on first name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2008-01-01', roles: ['Perpetrator']}
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([cyril, archer, malory])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: cyril.id, perpetrator: cyril},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('sorts victims with the same birth date and last name based when one victim has no first name', () => {
    const malory = {id: '2', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2008-01-01', roles: ['Perpetrator']}
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Victim']}

    const participants = Immutable.fromJS([cyril, archer, malory])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: cyril.id, perpetrator: cyril},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators based on their birth date', () => {
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([archer, malory, cyril])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: archer.id, perpetrator: archer},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators with no birth date to the end of the list', () => {
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Perpetrator']}
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2010-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([archer, malory, cyril])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: archer.id, perpetrator: archer},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators with the same birth date based on last name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([malory, cyril, archer])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: archer.id, perpetrator: archer},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators with the same birth date when one has no last name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
    const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([malory, cyril, archer])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: archer.id, perpetrator: archer},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators with the same birth date when both have no last name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '1990-02-02', roles: ['Victim']}
    const cyril = {id: '4', first_name: 'Cyril', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
    const archer = {id: '1', first_name: 'Sterling', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([malory, archer, cyril])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: cyril.id, perpetrator: cyril},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: malory.id, victim: malory, perpetrator_id: archer.id, perpetrator: archer},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators with the same birth date and last name based on first name', () => {
    const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2008-01-01', roles: ['Victim']}
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([cyril, archer, malory])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: archer.id, perpetrator: archer},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('within a victim group, sorts perpetrators with the same birth date and last name when one has no first name', () => {
    const malory = {id: '2', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}
    const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', date_of_birth: '2008-01-01', roles: ['Victim']}
    const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', date_of_birth: '2005-01-01', roles: ['Perpetrator']}

    const participants = Immutable.fromJS([cyril, archer, malory])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: archer.id, perpetrator: archer},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: cyril.id, victim: cyril, perpetrator_id: malory.id, perpetrator: malory},
    ])

    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })
})

describe('buildNewAllegations', () => {
  const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Victim', 'Perpetrator']}
  const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', roles: ['Perpetrator']}
  const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', roles: ['Anonymous Reporter']}
  const lana = {id: '5', first_name: 'Lana', last_name: 'Kane', roles: ['Perpetrator']}
  const pam = {id: '6', first_name: 'Pam', last_name: 'Poovey', roles: ['Victim']}
  const screeningId = '3'

  it('returns combinations of victims and perpetrators', () => {
    const participants = Immutable.fromJS([archer, malory, cyril, lana, pam])
    const allegations = Immutable.List()
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: lana.id, perpetrator: lana},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: lana.id, perpetrator: lana},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(result.size).toEqual(5)
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('returns an empty list when there are no victims or perpetrators', () => {
    expect(AllegationsHelper.sortedAllegationsList(screeningId, Immutable.List(), Immutable.List())).toEqual(
      Immutable.List()
    )
  })

  it('does not add allegations when all possible allegations are persisted', () => {
    const participants = Immutable.fromJS([archer, malory, pam])
    const allegations = Immutable.fromJS([
      {id: '123', screening_id: '3', victim_id: '1', perpetrator_id: '2'},
      {id: '456', screening_id: '3', victim_id: '6', perpetrator_id: '1'},
      {id: '789', screening_id: '3', victim_id: '6', perpetrator_id: '2'},
    ])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: '789', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
      {id: '456', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(result.size).toEqual(3)
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('interleaves possible and persisted allegations', () => {
    const participants = Immutable.fromJS([archer, malory, pam, cyril, lana])
    const allegations = Immutable.fromJS([
      {id: '123', screening_id: '3', victim_id: '1', perpetrator_id: '2'},
      {id: '456', screening_id: '3', victim_id: '6', perpetrator_id: '1'},
      {id: '789', screening_id: '3', victim_id: '6', perpetrator_id: '2'},
    ])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: lana.id, perpetrator: lana},
      {id: '789', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
      {id: '456', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: lana.id, perpetrator: lana},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(result.size).toEqual(5)
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('returns the appropriate values when allegationsEdits is null', () => {
    const allegationsEdits = null
    const participants = Immutable.fromJS([archer, malory])
    const allegations = Immutable.fromJS([
      {id: '123', screening_id: '3', victim_id: '1', perpetrator_id: '2'},
    ])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations, allegationsEdits)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('uses the persisted allegation types when there are no edits', () => {
    const allegationsEdits = Immutable.List()
    const participants = Immutable.fromJS([archer, malory])
    const allegations = Immutable.fromJS([
      {id: '123', screening_id: '3', victim_id: '1', perpetrator_id: '2', allegation_types: ['General neglect']},
    ])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations, allegationsEdits)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: ['General neglect'], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('merges the allegationsEdits into the returned allegations', () => {
    const allegationsEdits = Immutable.fromJS({1: {2: ['General neglect']}})
    const participants = Immutable.fromJS([archer, malory])
    const allegations = Immutable.fromJS([
      {id: '123', screening_id: '3', victim_id: '1', perpetrator_id: '2'},
    ])
    const result = AllegationsHelper.sortedAllegationsList(screeningId, participants, allegations, allegationsEdits)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: ['General neglect'], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })
})

describe('removeInvalidAllegations', () => {
  it('does not explode if a participant has no roles object', () => {
    const participant = Immutable.fromJS({id: '2'})
    const allegations = Immutable.fromJS({2: {3: ['General neglect']}, 1: {3: ['General neglect']}})

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    const expectedAllegations = Immutable.fromJS({1: {3: ['General neglect']}})
    expect(returnedAllegations.toJS()).toEqual(expectedAllegations.toJS())
    expect(Immutable.is(returnedAllegations, expectedAllegations)).toEqual(true)
  })

  it('does not explode if passed an empty allegations set', () => {
    const participant = Immutable.fromJS({id: '2', roles: []})
    const allegations = null

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    expect(returnedAllegations.toJS()).toEqual({})
    expect(Immutable.is(returnedAllegations, Immutable.Map())).toEqual(true)
  })

  it('removes allegations for a participant if the participant is not a victim', () => {
    const participant = Immutable.fromJS({id: '2', roles: []})
    const allegations = Immutable.fromJS({2: {3: ['General neglect']}, 1: {3: ['General neglect']}})

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    const expectedAllegations = Immutable.fromJS({1: {3: ['General neglect']}})
    expect(returnedAllegations.toJS()).toEqual(expectedAllegations.toJS())
    expect(Immutable.is(returnedAllegations, expectedAllegations)).toEqual(true)
  })

  it('does not remove allegations for a participant if the participant is a victim', () => {
    const participant = Immutable.fromJS({id: '2', roles: ['Victim']})
    const allegations = Immutable.fromJS({2: {3: ['General neglect']}, 1: {3: ['General neglect']}})

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    expect(returnedAllegations.toJS()).toEqual(allegations.toJS())
    expect(Immutable.is(returnedAllegations, allegations)).toEqual(true)
  })

  it('removes allegations for a participant if the participant is not a perpetrator', () => {
    const participant = Immutable.fromJS({id: '2', roles: []})
    const allegations = Immutable.fromJS({3: {2: ['General neglect'], 1: ['General neglect']}})

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    const expectedAllegations = Immutable.fromJS({3: {1: ['General neglect']}})
    expect(returnedAllegations.toJS()).toEqual(expectedAllegations.toJS())
    expect(Immutable.is(returnedAllegations, expectedAllegations)).toEqual(true)
  })

  it('does not remove allegations for a participant if the participant is a perpetrator', () => {
    const participant = Immutable.fromJS({id: '2', roles: ['Perpetrator']})
    const allegations = Immutable.fromJS({3: {2: ['General neglect'], 1: ['General neglect']}})

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    expect(returnedAllegations.toJS()).toEqual(allegations.toJS())
    expect(Immutable.is(returnedAllegations, allegations)).toEqual(true)
  })

  it('removes allegations for a participant if the participant is not a victim nor a perpetrator', () => {
    const participant = Immutable.fromJS({id: '2', roles: []})
    const allegations = Immutable.fromJS({
      3: {2: ['General neglect'], 1: ['General neglect']},
      2: {4: ['General neglect']},
    })

    const returnedAllegations = AllegationsHelper.removeInvalidAllegations(participant, allegations)
    const expectedAllegations = Immutable.fromJS({3: {1: ['General neglect']}})
    expect(returnedAllegations.toJS()).toEqual(expectedAllegations.toJS())
    expect(Immutable.is(returnedAllegations, expectedAllegations)).toEqual(true)
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
      'At risk, sibling abused',
    ]
    allegationsRequiringReports.forEach((allegation) => {
      const allegations = Immutable.fromJS([
        {allegation_types: [allegation]},
      ])

      const result = AllegationsHelper.areCrossReportsRequired(allegations)
      expect(result).toEqual(true)
    })
  })

  it('returns false if no allegations require cross reports', () => {
    const allegationsNotRequiringReports = [
      'Caretaker absent/incapacity',
      'General neglect',
    ]
    allegationsNotRequiringReports.forEach((allegation) => {
      const allegations = Immutable.fromJS([
        {allegation_types: [allegation]},
      ])

      const result = AllegationsHelper.areCrossReportsRequired(allegations)
      expect(result).toEqual(false)
    })
  })

  it('returns true if only 1 of multiple allegations requires cross reports', () => {
    const allegations = Immutable.fromJS([
      {allegation_types: ['General neglect', 'Severe neglect']},
    ])

    const result = AllegationsHelper.areCrossReportsRequired(allegations)
    expect(result).toEqual(true)
  })
})

describe('areAllegationsRequired', () => {
  it('returns true when screening decision is null', () => {
    const screening = {}
    expect(AllegationsHelper.areAllegationsRequired(screening)).toEqual(false)
  })

  it('returns true when screening decision is a value other than promote to referral', () => {
    const screening = {screening_decision: 'differential_response'}
    expect(AllegationsHelper.areAllegationsRequired(screening)).toEqual(false)
  })

  it('returns true when screening decision is promote to referral', () => {
    const screening = {screening_decision: 'promote_to_referral'}
    expect(AllegationsHelper.areAllegationsRequired(screening)).toEqual(true)
  })
})

describe('areValidAllegationsPresent', () => {
  it('returns true if any allegations have a type', () => {
    const allegations = Immutable.fromJS([
      {allegation_types: []},
      {allegation_types: ['exploitation']},
    ])

    expect(AllegationsHelper.areValidAllegationsPresent(allegations)).toEqual(true)
  })

  it('returns false if no allegations have a type', () => {
    const allegations = Immutable.fromJS([
      {allegation_types: []},
      {allegation_types: []},
    ])

    expect(AllegationsHelper.areValidAllegationsPresent(allegations)).toEqual(false)
  })
})

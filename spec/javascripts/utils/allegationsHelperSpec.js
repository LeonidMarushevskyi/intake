import {addNewAllegations} from 'utils/allegationsHelper'
import Immutable from 'immutable'

describe('addNewAllegations', () => {
  const archer = {id: '1', first_name: 'Sterling', last_name: 'Archer', roles: ['Victim', 'Perpetrator']}
  const malory = {id: '2', first_name: 'Malory', last_name: 'Archer', roles: ['Perpetrator']}
  const cyril = {id: '4', first_name: 'Cyril', last_name: 'Figgus', roles: ['Anonymous Reporter']}
  const lana = {id: '5', first_name: 'Lana', last_name: 'Kane', roles: ['Perpetrator']}
  const pam = {id: '6', first_name: 'Pam', last_name: 'Poovey', roles: ['Victim']}
  const screeningId = '3'

  it('returns combinations of victims and perpetrators', () => {
    const participants = Immutable.fromJS([archer, malory, cyril, lana, pam])
    const allegations = Immutable.List()
    const result = addNewAllegations(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: lana.id, perpetrator: lana},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: lana.id, perpetrator: lana},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(result.size).toEqual(5)
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('returns an empty list when there are no victims or perpetrators', () => {
    expect(addNewAllegations(screeningId, Immutable.List(), Immutable.List())).toEqual(
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
    const result = addNewAllegations(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: '456', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
      {id: '789', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
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
    const result = addNewAllegations(screeningId, participants, allegations)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, allegation_types: [], victim_id: archer.id, victim: archer, perpetrator_id: lana.id, perpetrator: lana},
      {id: '456', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
      {id: '789', screening_id: screeningId, allegation_types: [], victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
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
    const result = addNewAllegations(screeningId, participants, allegations, allegationsEdits)
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
    const result = addNewAllegations(screeningId, participants, allegations, allegationsEdits)
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
    const result = addNewAllegations(screeningId, participants, allegations, allegationsEdits)
    const expectedResult = Immutable.fromJS([
      {id: '123', screening_id: screeningId, allegation_types: ['General neglect'], victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })
})

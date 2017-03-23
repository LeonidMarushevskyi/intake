import {addNewAllegations} from 'utils/allegationsHelper'
import Immutable from 'immutable'

describe('addNewAllegations', () => {
  const archer = {id: 1, first_name: 'Sterling', last_name: 'Archer', roles: ['Victim', 'Perpetrator']}
  const malory = {id: 2, first_name: 'Malory', last_name: 'Archer', roles: ['Perpetrator']}
  const cyril = {id: 4, first_name: 'Cyril', last_name: 'Figgus', roles: ['Anonymous Reporter']}
  const lana = {id: 5, first_name: 'Lana', last_name: 'Kane', roles: ['Perpetrator']}
  const pam = {id: 6, first_name: 'Pam', last_name: 'Poovey', roles: ['Victim']}
  const participants = Immutable.fromJS([archer, malory, cyril, lana, pam])
  const screeningId = '3'

  it('returns combinations of victims and perpetrators', () => {
    const result = addNewAllegations(screeningId, participants)
    const expectedResult = Immutable.fromJS([
      {id: null, screening_id: screeningId, victim_id: archer.id, victim: archer, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, victim_id: archer.id, victim: archer, perpetrator_id: lana.id, perpetrator: lana},
      {id: null, screening_id: screeningId, victim_id: pam.id, victim: pam, perpetrator_id: archer.id, perpetrator: archer},
      {id: null, screening_id: screeningId, victim_id: pam.id, victim: pam, perpetrator_id: malory.id, perpetrator: malory},
      {id: null, screening_id: screeningId, victim_id: pam.id, victim: pam, perpetrator_id: lana.id, perpetrator: lana},
    ])
    expect(result.toJS()).toEqual(expectedResult.toJS())
    expect(result.size).toEqual(5)
    expect(Immutable.is(result, expectedResult)).toEqual(true)
  })

  it('returns an empty list when there are no victims or perpetrators', () => {
    expect(addNewAllegations(screeningId, Immutable.List())).toEqual(
      Immutable.List()
    )
  })
})

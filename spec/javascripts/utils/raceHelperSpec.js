import Immutable from 'immutable'
import bestMatchesByRace from 'utils/raceHelper'

describe('raceHelper', () => {
  describe('bestMatchesByRace', () => {
    it('returns first race in the selected race_type', () => {
      const races = Immutable.fromJS([
        {race: 'Asian', race_detail: 'Korean'},
        {race: 'Asian', race_detail: 'Chinese'},
      ])
      const expectedRaces = Immutable.fromJS([
        {race: 'Asian', race_detail: 'Korean'},
      ])
      expect(bestMatchesByRace(races)).toEqual(expectedRaces)
    })

    it('returns race with race_detail when possible', () => {
      const races = Immutable.fromJS([
        {race: 'Asian'},
        {race: 'Asian', race_detail: 'Chinese'},
      ])
      const expectedRaces = Immutable.fromJS([
        {race: 'Asian', race_detail: 'Chinese'},
      ])
      expect(bestMatchesByRace(races)).toEqual(expectedRaces)
    })

    it('returns something for each race', () => {
      const races = Immutable.fromJS([
        {race: 'White', race_detail: 'Romanian'},
        {race: 'Asian', race_detail: 'Hmong'},
        {race: 'Asian'},
        {race: 'Black or African American'},
        {race: 'White'},
        {race: 'Asian', race_detail: 'Chinese'},
      ])
      const expectedRaces = Immutable.fromJS([
        {race: 'White', race_detail: 'Romanian'},
        {race: 'Asian', race_detail: 'Hmong'},
        {race: 'Black or African American'},
      ])
      expect(bestMatchesByRace(races)).toEqual(expectedRaces)
    })
  })
})

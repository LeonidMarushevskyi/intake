import {fromJS} from 'immutable'
import {
  getPeopleSelector,
} from 'selectors/screening/relationshipsSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('relationshipsViewSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const emptyState = fromJS({relationships: []})

  describe('getPeopleSelector', () => {
    it('returns a list of people or an empty list if there are no people', () => {
      const relationships = [
        {first_name: 'Ricky', last_name: 'Robinson'},
        {first_name: 'Johny', last_name: 'Robinson'},
        {first_name: 'Will', last_name: 'Carlson'},
      ]
      const state = fromJS({relationships})
      expect(getPeopleSelector(state)).toEqualImmutable(fromJS([
        {
          name: 'Ricky Robinson',
          relationships: [],
        },
        {
          name: 'Johny Robinson',
          relationships: [],
        },
        {
          name: 'Will Carlson',
          relationships: [],
        },
      ]))
      expect(getPeopleSelector(emptyState)).toEqualImmutable(fromJS([]))
    })

    it('returns a list of relationships for each person', () => {
      const relationships = [
        {
          first_name: 'Ricky',
          last_name: 'Robinson',
          relationships: [
            {
              related_person_first_name: 'Johny',
              related_person_last_name: 'Robinson',
              related_person_relationship: '17',
              indexed_person_relationship: '17',
              legacy_descriptor: {
                legacy_id: '2',
              },
              person_card_exists: true,
            },
            {
              related_person_first_name: 'Will',
              related_person_last_name: 'Carlson',
              related_person_relationship: '297',
              indexed_person_relationship: '258',
              legacy_descriptor: {
                legacy_id: '1',
              },
            },
          ],
        },
        {
          first_name: 'Johny',
          last_name: 'Robinson',
          relationships: [
            {
              related_person_first_name: 'Ricky',
              related_person_last_name: 'Robinson',
              related_person_relationship: '17',
              indexed_person_relationship: '17',
              legacy_descriptor: {
                legacy_id: '3',
              },
            },
            {
              related_person_first_name: 'Will',
              related_person_last_name: 'Carlson',
              related_person_relationship: '297',
              indexed_person_relationship: '258',
              legacy_descriptor: {
                legacy_id: '1',
              },
            },
          ],
        },
      ]

      const relationshipTypes = [
        {code: '17', value: 'Brother'},
        {code: '258', value: 'Nephew (Paternal)'},
        {code: '297', value: 'Uncle (Paternal)'},
      ]
      const state = fromJS({relationships, relationshipTypes})

      expect(getPeopleSelector(state)).toEqualImmutable(fromJS([
        {
          name: 'Ricky Robinson',
          relationships: [
            {relatee: 'Johny Robinson', legacy_descriptor: {legacy_id: '2'}, type: 'Brother', person_card_exists: true},
            {relatee: 'Will Carlson', legacy_descriptor: {legacy_id: '1'}, type: 'Nephew (Paternal)', person_card_exists: true},
          ],
        },
        {
          name: 'Johny Robinson',
          relationships: [
            {relatee: 'Ricky Robinson', legacy_descriptor: {legacy_id: '3'}, type: 'Brother', person_card_exists: true},
            {relatee: 'Will Carlson', legacy_descriptor: {legacy_id: '1'}, type: 'Nephew (Paternal)', person_card_exists: true},
          ],
        },
      ]))
    })
  })
})

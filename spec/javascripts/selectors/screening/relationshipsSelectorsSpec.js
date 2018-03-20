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
            },
            {
              related_person_first_name: 'Will',
              related_person_last_name: 'Carlson',
              related_person_relationship: '297',
              indexed_person_relationship: '258',
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
            },
            {
              related_person_first_name: 'Will',
              related_person_last_name: 'Carlson',
              related_person_relationship: '297',
              indexed_person_relationship: '258',
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
            {relatee: 'Johny Robinson', type: 'Brother'},
            {relatee: 'Will Carlson', type: 'Nephew (Paternal)'},
          ],
        },
        {
          name: 'Johny Robinson',
          relationships: [
            {relatee: 'Ricky Robinson', type: 'Brother'},
            {relatee: 'Will Carlson', type: 'Nephew (Paternal)'},
          ],
        },
      ]))
    })
  })
})

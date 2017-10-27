import {fromJS} from 'immutable'
import {
  getPeopleSelector,
  getRelationshipsSelector,
} from 'selectors/RelationshipsSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('relationshipsViewSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const emptyInvestigation = {
    investigation: {
      relationships: [],
    },
  }

  const emptyState = fromJS(emptyInvestigation)

  describe('getPeopleSelector', () => {
    it('returns a list of people or an empty list if there are no people', () => {
      const relationships = [
        {first_name: 'Ricky', last_name: 'Robinson'},
        {first_name: 'Johny', last_name: 'Robinson'},
        {first_name: 'Will', last_name: 'Carlson'},
      ]
      const investigation = {investigation: {relationships}}
      const state = fromJS(investigation)
      expect(getPeopleSelector(state)).toEqualImmutable(fromJS(['Ricky Robinson', 'Johny Robinson', 'Will Carlson']))
      expect(getPeopleSelector(emptyState)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getRelationshipsSelector', () => {
    it('returns a list of relationships or an empty list if there are no relationships', () => {
      const relationships = [
        {
          first_name: 'Ricky',
          last_name: 'Robinson',
          relationship_to: [
            {
              related_person_first_name: 'Johny',
              related_person_last_name: 'Robinson',
              related_person_relationship: 'Brother',
              indexed_person_relationship: 'Brother',
            },
            {
              related_person_first_name: 'Will',
              related_person_last_name: 'Carlson',
              related_person_relationship: 'Friend',
              indexed_person_relationship: 'Friend',
            },
          ],
        },
        {
          first_name: 'Johny',
          last_name: 'Robinson',
          relationship_to: [
            {
              related_person_first_name: 'Ricky',
              related_person_last_name: 'Robinson',
              related_person_relationship: 'Brother',
              indexed_person_relationship: 'Brother',
            },
            {
              related_person_first_name: 'Will',
              related_person_last_name: 'Carlson',
              related_person_relationship: 'Friend',
              indexed_person_relationship: 'Friend',
            },
          ],
        },
      ]
      const investigation = {investigation: {relationships}}
      const state = fromJS(investigation)

      expect(getRelationshipsSelector(state)).toEqualImmutable(fromJS([
        {person: 'Ricky Robinson', relatee: 'Johny Robinson', relationship: 'Brother'},
        {person: 'Ricky Robinson', relatee: 'Will Carlson', relationship: 'Friend'},
        {person: 'Johny Robinson', relatee: 'Ricky Robinson', relationship: 'Brother'},
        {person: 'Johny Robinson', relatee: 'Will Carlson', relationship: 'Friend'},
      ]))
      expect(getPeopleSelector(emptyState)).toEqualImmutable(fromJS([]))
    })
  })
})

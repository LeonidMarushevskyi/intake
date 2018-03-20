import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {systemCodeDisplayValue, getRelationshipTypesSelector} from 'selectors/systemCodeSelectors'

export const getScreeningRelationships = (state) => (state.get('relationships', List()))

const isRelationshipCardExists = (people, relationship) => {
  if (people && people.size > 0) {
    const index = people.findIndex((person) => {
      const personjs = person.toJS()
      return personjs.legacy_id === relationship.legacy_descriptor.legacy_id
    })
    const none = -1
    if (index !== none) {
      return false
    }
  }
  return true
}

export const getPeopleSelector = createSelector(
  getScreeningRelationships,
  getRelationshipTypesSelector,
  (people, relationshipTypes) => people.map((person) => Map({
    name: nameFormatter({...person.toJS()}),
    relationships: person.get('relationships', List()).map((relationship) => (
      Map({
        relatee: nameFormatter({
          first_name: relationship.get('related_person_first_name'),
          last_name: relationship.get('related_person_last_name'),
          middle_name: relationship.get('related_person_middle_name'),
          name_suffix: relationship.get('related_person_name_suffix'),
        }),
        legacy_descriptor: relationship.get('legacy_descriptor'),
        type: systemCodeDisplayValue(relationship.get('indexed_person_relationship'), relationshipTypes),
        person_card_exists: isRelationshipCardExists(people, relationship.toJS()),
      })
    )),
  }))
)

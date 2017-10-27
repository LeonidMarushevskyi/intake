import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {getInvestigationSelector} from 'selectors/investigationSelectors'
import nameFormatter from 'utils/nameFormatter'

export const getPeopleWithRelationships = createSelector(
  getInvestigationSelector,
  (investigation) => (investigation.get('relationships', List()))
)

export const getPeopleSelector = createSelector(
  getPeopleWithRelationships,
  (people) => people.map((person) => nameFormatter({
    name_default: '',
    first_name: person.get('first_name', ''),
    last_name: person.get('last_name', ''),
    middle_name: person.get('middle_name', ''),
    name_suffix: person.get('name_suffix', ''),
  }))
)

export const getRelationshipsSelector = createSelector(
  getPeopleWithRelationships,
  (people) => people.map((person) => person.get('relationship_to', Map()).map((related_to) => (Map({
    person: nameFormatter({
      name_default: '',
      first_name: person.get('first_name', ''),
      last_name: person.get('last_name', ''),
      middle_name: person.get('middle_name', ''),
      name_suffix: person.get('name_suffix', ''),
    }),
    relatee: nameFormatter({
      name_default: '',
      first_name: related_to.get('related_person_first_name', ''),
      last_name: related_to.get('related_person_last_name', ''),
      middle_name: related_to.get('related_person_middle_name', ''),
      name_suffix: related_to.get('related_person_name_suffix', ''),
    }),
    relationship: related_to.get('indexed_person_relationship', ''),
  })))
  ).flatten(true)
)

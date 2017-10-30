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
  (people) => people.map((person) => Map({
    name: nameFormatter({...person.toJS()}),
    relationships: person.get('relationship_to', List()).map((relationship) => (
      Map({
        relatee: nameFormatter({
          first_name: relationship.get('related_person_first_name'),
          last_name: relationship.get('related_person_last_name'),
          middle_name: relationship.get('related_person_middle_name'),
          name_suffix: relationship.get('related_person_name_suffix'),
        }),
        type: relationship.get('indexed_person_relationship'),
      })
    )),
  }))
)

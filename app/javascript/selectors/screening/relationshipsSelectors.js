import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import nameFormatter from 'utils/nameFormatter'

export const getScreeningRelationships = (state) => (state.get('relationships', List()))

export const getPeopleSelector = createSelector(
  getScreeningRelationships,
  (people) => people.map((person) => Map({
    name: nameFormatter({...person.toJS()}),
    relationships: person.get('relationships', List()).map((relationship) => (
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

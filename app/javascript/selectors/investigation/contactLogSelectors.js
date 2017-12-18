import {List, fromJS} from 'immutable'
import {createSelector} from 'reselect'
import {dateTimeFormatter} from 'utils/dateFormatter'
import nameFormatter from 'utils/nameFormatter'
import {
  getStatusesSelector,
  getCommunicationMethodsSelector,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'

const namesOfPeople = (people) => people.map((person) => nameFormatter(person))

export const getContactLogsSelector = createSelector(
  getStatusesSelector,
  getCommunicationMethodsSelector,
  (state) => state.getIn(['investigation', 'legacy_descriptor', 'legacy_id']),
  (state) => state.getIn(['investigation', 'contacts'], List()),
  (contactStatuses, communicationMethods, investigationId, contacts) => (
    contacts.sortBy((contact) => contact.get('started_at')).map(
      (contact) => fromJS({
        id: contact.getIn(['legacy_descriptor', 'legacy_id']),
        investigationId,
        people: namesOfPeople(contact.get('people', List()).toJS()),
        startedAt: dateTimeFormatter(contact.get('started_at')),
        status: systemCodeDisplayValue(contact.get('status'), contactStatuses),
        method: systemCodeDisplayValue(contact.get('communication_method'), communicationMethods),
        note: contact.get('note'),
      })
    )
  )
)

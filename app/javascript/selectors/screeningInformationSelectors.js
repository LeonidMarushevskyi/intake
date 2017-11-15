import {createSelector} from 'reselect'
import {fromJS} from 'immutable'
import {
  isRequiredCreate,
  isFutureDatetimeCreate,
  isBeforeDatetimeCreate,
  combineCompact,
} from 'utils/validator'

export const getErrorsSelector = createSelector(
  (state) => state.getIn(['screening', 'assignee']),
  (state) => state.getIn(['screening', 'communication_method']),
  (state) => state.getIn(['screening', 'started_at']),
  (state) => state.getIn(['screening', 'ended_at']),
  (assignee, communicationMethod, startedAt, endedAt) => fromJS({
    assignee: combineCompact(
      isRequiredCreate(assignee, 'Please enter an assigned worker.')
    ),
    communication_method: combineCompact(
      isRequiredCreate(communicationMethod, 'Please select a communication method.')
    ),
    ended_at: combineCompact(
      isFutureDatetimeCreate(endedAt, 'The end date and time cannot be in the future.')
    ),
    started_at: combineCompact(
      isRequiredCreate(startedAt, 'Please enter a screening start date.'),
      isFutureDatetimeCreate(startedAt, 'The start date and time cannot be in the future.'),
      isBeforeDatetimeCreate(
        endedAt,
        startedAt,
        'The start date and time must be before the end date and time.'
      )
    ),
  })
)

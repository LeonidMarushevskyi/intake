import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getInvestigationSelector = (state) => state.get('investigation') || Map()

export const getInvestigationIdValueSelector = createSelector(
  getInvestigationSelector,
  (investigation) => investigation.get('id')
)

export const getInvestigationNameValueSelector = createSelector(
  getInvestigationSelector,
  (investigation) => investigation.getIn(['screening_summary', 'name'])
)

export const getInvestigationTitleSelector = createSelector(
  getInvestigationIdValueSelector,
  getInvestigationNameValueSelector,
  (id, name) => name || `Investigation ${id}`
)

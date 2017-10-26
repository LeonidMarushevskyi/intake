import {createSelector} from 'reselect'
import {List, Map} from 'immutable'
import {getInvestigationSelector} from 'selectors/investigationSelectors'
import {getAllegationTypesSelector} from 'selectors/systemCodeSelectors'
import nameFormatter from 'utils/nameFormatter'

const systemCodeDisplayValue = (code, systemCodes) => systemCodes.find(
  (systemCode) => (systemCode.get('code') === code), null, Map()
).get('value')

export const getFormattedAllegationsSelector = createSelector(
  getInvestigationSelector,
  getAllegationTypesSelector,
  (investigation, allegationTypes) => (
    investigation.get('allegations', List()).map((allegation) => (
      Map({
        victim: nameFormatter(allegation.get('victim').toJS()),
        perpetrator: nameFormatter(allegation.get('perpetrator').toJS()),
        type: systemCodeDisplayValue(allegation.get('allegation_type'), allegationTypes),
      })
    ))
  )
)

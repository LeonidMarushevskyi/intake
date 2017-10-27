import {createSelector} from 'reselect'
import {List, Map} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import nameFormatter from 'utils/nameFormatter'
import {siblingAtRiskHasRequiredComplementaryAllegations} from 'utils/allegationsHelper'
const FLATTEN_LEVEL = 1

const getAllegationsSelector = createSelector(
  (state) => state.getIn(['screening', 'allegations'], List()),
  (state) => state.getIn(['screening', 'participants'], List()),
  (allegations, people) => allegations.map((allegation) => {
    const allegation_types = allegation.get('allegation_types')
    const victim_id = allegation.get('victim_id')
    const victim = people.find((person) => person.get('id') === victim_id)
    const perpetrator_id = allegation.get('perpetrator_id')
    const perpetrator = people.find((person) => person.get('id') === perpetrator_id)
    return Map({allegation_types, victim, victim_id, perpetrator})
  })
)

const getAllegationsWithTypesSelector = createSelector(
  getAllegationsSelector,
  (allegations) => allegations.filter((allegation) => (
    !allegation.get('allegation_types', List()).isEmpty()
  ))
)

export const getFormattedAllegationsSelector = createSelector(
  getAllegationsSelector,
  (allegations) => (
    allegations.map((allegation) => (
      allegation.get('allegation_types', List()).sort().map((allegationType) => (
        Map({
          victim: nameFormatter(allegation.get('victim').toJS()),
          perpetrator: nameFormatter(allegation.get('perpetrator').toJS()),
          type: allegationType,
        })
      ))
    )).flatten(FLATTEN_LEVEL)
  )
)

export const getAllegationsRequiredValueSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('screening_decision') === 'promote_to_referral'
)

export const getAllegationsAlertErrorMessageSelector = createSelector(
  getScreeningSelector,
  getAllegationsRequiredValueSelector,
  getAllegationsSelector,
  getAllegationsWithTypesSelector,
  (screening, required, allegations, allegationsWithTypes) => {
    if (!siblingAtRiskHasRequiredComplementaryAllegations(allegations)) {
      return 'Any allegations of Sibling at Risk must be accompanied by another allegation.'
    } else if (required && allegationsWithTypes.isEmpty()) {
      return 'Any report that is promoted for referral must include at least one allegation.'
    } else {
      return undefined
    }
  }
)

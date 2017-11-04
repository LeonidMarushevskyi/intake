import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import nameFormatter from 'utils/nameFormatter'
import {siblingAtRiskHasRequiredComplementaryAllegations} from 'utils/allegationsHelper'
import ALLEGATION_TYPES from 'enums/AllegationTypes'
const FLATTEN_LEVEL = 1

const getPeopleSelector = (state) => state.get('participants', List())
const getAllegationsFormSelector = (state) => state.get('allegationsForm', List())
export const getAllegationTypesSelector = () => (
  fromJS(ALLEGATION_TYPES.map((type) => ({label: type.value, value: type.value})))
)

const getVictimsSelector = createSelector(
  getPeopleSelector,
  (people) => people.filter((person) => person.get('roles', List()).includes('Victim'))
)

const getPerpetratorsSelector = createSelector(
  getPeopleSelector,
  (people) => people.filter((person) => person.get('roles', List()).includes('Perpetrator'))
)

const getAllegationsWithTypesSelector = createSelector(
  getAllegationsFormSelector,
  (allegations) => allegations.filterNot((allegation) => (
    allegation.get('allegationTypes').filterNot((type) => type === '').isEmpty()
  ))
)

const getAllegationsToSaveSelector = createSelector(
  getAllegationsWithTypesSelector,
  (allegations) => allegations.map((allegation) => Map({
    victim_id: allegation.get('victimId'),
    perpetrator_id: allegation.get('perpetratorId'),
    allegation_types: allegation.get('allegationTypes'),
  }))
)

export const getScreeningWithAllegationsEditsSelector = createSelector(
  getScreeningSelector,
  getAllegationsToSaveSelector,
  (screening, allegations) => screening.set('allegations', allegations)
)

export const getFormattedAllegationsSelector = createSelector(
  getVictimsSelector,
  getPerpetratorsSelector,
  getAllegationsFormSelector,
  (victims, perpetrators, allegations) => (
    victims.map((victim) => (
      perpetrators.map((perpetrator, index) => {
        const victimId = victim.get('id')
        const perpetratorId = perpetrator.get('id')
        const allegationTypes = allegations.find((allegation) => (
          allegation.get('victimId') === victimId && allegation.get('perpetratorId') === perpetratorId
        ), null, Map()).get('allegationTypes', List())
        return fromJS({
          victimName: index === 0 ? nameFormatter(victim.toJS()) : '',
          victimId,
          perpetratorName: nameFormatter(perpetrator.toJS()),
          perpetratorId,
          allegationTypes,
        })
      })
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
  getAllegationsFormSelector,
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

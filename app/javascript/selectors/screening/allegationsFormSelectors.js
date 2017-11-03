import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import nameFormatter from 'utils/nameFormatter'

const FLATTEN_LEVEL = 1
const getPeopleSelector = (state) => state.get('participants', List())
const getAllegationsFormSelector = (state) => state.get('allegationsForm', List())

const getVictimsSelector = createSelector(
  getPeopleSelector,
  (people) => people.filter((person) => person.get('roles', List()).includes('Victim'))
)

const getPerpetratorsSelector = createSelector(
  getPeopleSelector,
  (people) => people.filter((person) => person.get('roles', List()).includes('Perpetrator'))
)

const getAllegationsToSaveSelector = createSelector(
  getAllegationsFormSelector,
  (allegations) => allegations.filterNot((allegation) => (
    allegation.get('allegationTypes').filterNot((type) => type === '').isEmpty()
  )).map((allegation) => Map({
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

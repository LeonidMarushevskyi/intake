import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
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

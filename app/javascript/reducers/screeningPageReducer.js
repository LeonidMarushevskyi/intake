import * as IntakeConfig from 'common/config'
import {CREATE_PERSON_COMPLETE} from 'actions/personCardActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {Map} from 'immutable'
import {SET_SCREENING_PAGE_MODE, SET_PERSON_CARD_MODE} from 'actions/screeningPageActions'
import {createReducer} from 'utils/createReducer'

function peopleCards({participants}, mode) {
  return Map(
    participants.reduce((peopleCards, {id}) => ({...peopleCards, [id]: mode}), {})
  )
}

function modeOnCreatePerson() {
  if (IntakeConfig.isFeatureActive('release_two')) {
    return 'show'
  } else {
    return 'edit'
  }
}

export default createReducer(Map(), {
  [SET_SCREENING_PAGE_MODE]: (state, {payload: {mode}}) => state.set('mode', mode),
  [SET_PERSON_CARD_MODE]: (state, {payload: {personId, mode}}) => state.setIn(['peopleCards', personId], mode),
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      const mode = state.get('mode')
      return state.set('peopleCards', peopleCards(screening, mode))
    }
  },
  [CREATE_PERSON_COMPLETE]: (state, {payload: {person}, error}) => {
    if (error) {
      return state
    } else {
      return state.setIn(['peopleCards', person.id], modeOnCreatePerson())
    }
  },
})

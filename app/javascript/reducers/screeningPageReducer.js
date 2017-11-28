import * as IntakeConfig from 'common/config'
import {CREATE_PERSON_COMPLETE} from 'actions/personCardActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {Map} from 'immutable'
import {SET_SCREENING_PAGE_MODE, SET_PERSON_CARD_MODE} from 'actions/screeningPageActions'
import {createReducer} from 'utils/createReducer'

export default createReducer(Map(), {
  [SET_SCREENING_PAGE_MODE]: (state, {payload: {mode}}) => state.set('mode', mode),
  [SET_PERSON_CARD_MODE]: (state, {payload: {personId, mode}}) => state.setIn(['peopleCards', personId], mode),
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      const mode = state.get('mode')
      const peopleCards = screening.participants.reduce(
        (peopleCards, {id}) => ({...peopleCards, [id]: mode}),
        {}
      )
      return state.set('peopleCards', Map(peopleCards))
    }
  },
  [CREATE_PERSON_COMPLETE]: (state, {payload: {person}, error}) => {
    if (error) {
      return state
    } else if (IntakeConfig.isFeatureActive('release_two')) {
      return state.setIn(['peopleCards', person.id], 'show')
    } else {
      return state.setIn(['peopleCards', person.id], 'edit')
    }
  },
})

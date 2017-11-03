import {
  RESET_ALLEGATIONS_FORM,
  SET_ALLEGATION_TYPES,
} from 'actions/allegationsFormActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'

const buildAllegations = (allegations) => (
  fromJS(
    allegations.map((allegation) => ({
      id: allegation.id,
      victimId: allegation.victim_id,
      perpetratorId: allegation.perpetrator_id,
      allegationTypes: allegation.allegation_types,
    }))
  )
)

export default createReducer(List(), {
  [FETCH_SCREENING_COMPLETE](state, {payload: {screening}, error}) {
    if (error) {
      return state
    } else {
      const {allegations} = screening
      return buildAllegations(allegations)
    }
  },
  [SET_ALLEGATION_TYPES](state, {payload: {victimId, perpetratorId, allegationTypes}}) {
    return state.filterNot((allegation) => (
      allegation.get('victimId') === victimId && allegation.get('perpetratorId') === perpetratorId
    )).push(fromJS({id: null, victimId, perpetratorId, allegationTypes}))
  },
  [RESET_ALLEGATIONS_FORM](_state, {payload: {allegations}}) {
    return buildAllegations(allegations)
  },
})


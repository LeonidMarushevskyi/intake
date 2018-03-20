import * as matchers from 'jasmine-immutable-matchers'
import * as IntakeConfig from 'common/config'
import {
  fetchScreeningSuccess,
  createScreeningSuccess,
  saveSuccess,
} from 'actions/screeningActions'
import {
  createPersonSuccess,
} from 'actions/personCardActions'
import {fromJS} from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    jasmine.addMatchers(matchers)
    initialState = fromJS({
      addressTypes: [],
      allegationsForm: [],
      allegationTypes: [],
      communicationMethods: [],
      contact: {},
      contactForm: {},
      contactPurposes: [],
      contactStatuses: [],
      usStates: [],
      hispanicOriginCodes: [],
      unableToDetermineCodes: [],
      relationshipTypes: [],
      raceTypes: [],
      ethnicityTypes: [],
      languages: [],
      counties: [],
      addressCounties: [],
      countyAgencies: [],
      crossReportForm: {},
      errors: {},
      incidentInformationForm: {},
      investigation: {},
      involvements: {},
      locations: [],
      narrativeForm: {},
      participants: [],
      peopleForm: {},
      peopleSearch: {
        results: [],
        searchTerm: '',
        total: 0,
      },
      relationships: [],
      routing: {locationBeforeTransitions: null},
      screening: {},
      screeningInformationForm: {},
      screeningDecisionForm: {},
      screeningPage: {},
      screenings: [],
      snapshot: {},
      staff: {},
      screenResponseTimes: [],
      workerSafetyForm: {},
      userInfo: {},
    })
    store = createStore(rootReducer)
  })

  it('has initial state', () => {
    expect(store.getState()).toEqualImmutable(initialState)
  })

  it('handles fetch screening', () => {
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [{id: '2', legacy_id: '3', screening_id: '1'}],
      allegations: [],
      address: {},
    })
    const participants = screening.get('participants')
    const action = fetchScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening')).toEqualImmutable(
      screening.set('fetch_status', 'FETCHED')
    )
    expect(store.getState().get('participants')).toEqualImmutable(participants)
  })

  it('handles create screening', () => {
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [],
    })
    const action = createScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening')).toEqualImmutable(
      screening.set('fetch_status', 'FETCHED')
    )
    expect(store.getState().get('participants').isEmpty()).toEqual(true)
  })

  describe('when a screening already exists in the store', () => {
    beforeEach(() => {
      initialState = initialState.set(
        'screening',
        fromJS({
          id: '1',
          name: 'Mock screening',
          participants: [],
        })
      )
      store = createStore(rootReducer, initialState)
    })

    it('handles update screening', () => {
      const participants = fromJS([{id: '2', legacy_id: '3', screening_id: '1'}])
      const updatedScreening = initialState.get('screening').set('participants', participants)
      const action = saveSuccess(updatedScreening.toJS())
      store.dispatch(action)
      expect(store.getState().get('screening')).toEqualImmutable(
        updatedScreening.set('fetch_status', 'FETCHED')
      )
      expect(store.getState().get('participants')).toEqualImmutable(participants)
    })

    it('handles create participant', () => {
      spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
      const participant = {id: '2', legacy_id: '3', screening_id: '1'}
      const participants = fromJS([participant])
      const action = createPersonSuccess(participant)
      store.dispatch(action)
      expect(store.getState().get('participants')).toEqualImmutable(participants)
    })
  })
})

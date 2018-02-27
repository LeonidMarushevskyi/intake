import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {fromJS} from 'immutable'
import {saveScreeningCardSaga, saveScreeningCard} from 'sagas/saveScreeningCardSaga'
import {saveSuccess, saveFailure, saveCard, SAVE_SCREENING} from 'actions/screeningActions'
import {getScreeningWithAllegationsEditsSelector} from 'selectors/screening/allegationsFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithScreeningInformationEditsSelector,
} from 'selectors/screening/screeningInformationFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithNarrativeEditsSelector,
} from 'selectors/screening/narrativeFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithIncidentInformationEditsSelector,
} from 'selectors/screening/incidentInformationFormSelector'
import {
  getScreeningWithEditsSelector as getScreeningWithWorkerSafetyEditsSelector,
} from 'selectors/screening/workerSafetyFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithCrossReportEditsSelector,
} from 'selectors/screening/crossReportFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithDecisionEditsSelector,
} from 'selectors/screening/decisionFormSelectors'

describe('saveScreeningCardSaga', () => {
  it('saves screening on SAVE_SCREENING', () => {
    const gen = saveScreeningCardSaga()
    expect(gen.next().value).toEqual(takeEvery(SAVE_SCREENING, saveScreeningCard))
  })
})

describe('saveScreeningCard', () => {
  it('saves allegations edits and puts screening', () => {
    const action = saveCard('allegations')
    const screening = fromJS({id: 123, allegations: []})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithAllegationsEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('saves screening information edits and puts screening', () => {
    const action = saveCard('screening_information')
    const screening = fromJS({id: 123, name: 'My Screening'})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithScreeningInformationEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('saves narrative edits and puts screening', () => {
    const action = saveCard('narrative')
    const screening = fromJS({id: 123, narrative: 'My Narrative'})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithNarrativeEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('saves incident information edits and puts screening', () => {
    const action = saveCard('incident_information')
    const screening = fromJS({id: 123, incident_date: '01/01/1990'})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithIncidentInformationEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('saves worker safety edits and puts screening', () => {
    const action = saveCard('worker_safety')
    const screening = fromJS({id: 123, safety_alerts: []})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithWorkerSafetyEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('saves cross reports edits and puts screening', () => {
    const action = saveCard('cross_reports')
    const screening = fromJS({id: 123, cross_reports: []})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithCrossReportEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('saves decision edits and puts screening', () => {
    const action = saveCard('decision')
    const screening = fromJS({id: 123, decision: 'screen_out'})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithDecisionEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    expect(gen.next(screening).value).toEqual(
      put(saveSuccess(screening))
    )
  })

  it('puts errors when errors are thrown', () => {
    const action = saveCard('allegations')
    const screening = fromJS({id: 123, allegations: []})

    const gen = saveScreeningCard(action)
    expect(gen.next().value).toEqual(
      select(getScreeningWithAllegationsEditsSelector)
    )
    expect(gen.next(screening).value).toEqual(
      call(Utils.put, '/api/v1/screenings/123', screening.toJS())
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(saveFailure(error))
    )
  })
})

import 'babel-polyfill'
import {takeEvery, put, select} from 'redux-saga/effects'
import {fromJS} from 'immutable'
import {clearCardEditsSaga, clearCardEdits} from 'sagas/clearCardEditsSaga'
import {clearCardEdits as clearEdits, CLEAR_CARD_EDITS} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {resetAllegations} from 'actions/allegationsFormActions'
import {resetFieldValues as resetScreeningInformationValues} from 'actions/screeningInformationFormActions'
import {resetFieldValues as resetIncidentInformationValues} from 'actions/incidentInformationFormActions'
import {resetFieldValues as resetNarrativeFormValues} from 'actions/narrativeFormActions'
import {resetFieldValues as resetScreeningDecisionFormValues} from 'actions/screeningDecisionFormActions'
import {resetFieldValues as resetWorkerSafetyFormValues} from 'actions/workerSafetyFormActions'
import {resetFieldValues as resetCrossReportFormValues} from 'actions/crossReportFormActions'

describe('clearCardEditsSaga', () => {
  it('clears card edits on CLEAR_CARD_EDITS', () => {
    const gen = clearCardEditsSaga()
    expect(gen.next().value).toEqual(takeEvery(CLEAR_CARD_EDITS, clearCardEdits))
  })
})

describe('clearCardEdits', () => {
  it('resets allegations form values', () => {
    const action = clearEdits('allegations')
    const screening = fromJS({id: 123, allegations: []})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetAllegations(screening.toJS()))
    )
  })

  it('resets screening information form values', () => {
    const action = clearEdits('screening_information')
    const screening = fromJS({id: 123, name: 'My Screening'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetScreeningInformationValues(screening.toJS()))
    )
  })

  it('resets narrative form values', () => {
    const action = clearEdits('narrative')
    const screening = fromJS({id: 123, narrative: 'My Narrative'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetNarrativeFormValues(screening.toJS()))
    )
  })

  it('resets incident information form values', () => {
    const action = clearEdits('incident_information')
    const screening = fromJS({id: 123, incident_date: '01/01/1990'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetIncidentInformationValues(screening.toJS()))
    )
  })

  it('resets worker safety form values', () => {
    const action = clearEdits('worker_safety')
    const screening = fromJS({id: 123, safety_alerts: []})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetWorkerSafetyFormValues(screening.toJS()))
    )
  })

  it('resets cross report form values', () => {
    const action = clearEdits('cross_reports')
    const screening = fromJS({id: 123, cross_reports: []})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetCrossReportFormValues(screening.toJS()))
    )
  })

  it('resets decision form values', () => {
    const action = clearEdits('decision')
    const screening = fromJS({id: 123, decision: 'screen_out'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetScreeningDecisionFormValues(screening.toJS()))
    )
  })
})

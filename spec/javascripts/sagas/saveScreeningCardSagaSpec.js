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
import {cardName as allegationsCardName} from 'containers/screenings/AllegationsFormContainer'
import {cardName as screeningInformationCardName} from 'containers/screenings/ScreeningInformationFormContainer'
import {cardName as incidentInformationCardName} from 'containers/screenings/IncidentInformationFormContainer'
import {cardName as narrativeCardName} from 'containers/screenings/NarrativeFormContainer'
import {cardName as decisionCardName} from 'containers/screenings/DecisionFormContainer'
import {cardName as workerSafetyCardName} from 'containers/screenings/WorkerSafetyFormContainer'
import {cardName as crossReportsCardName} from 'containers/screenings/CrossReportFormContainer'

describe('saveScreeningCardSaga', () => {
  it('saves screening on SAVE_SCREENING', () => {
    const gen = saveScreeningCardSaga()
    expect(gen.next().value).toEqual(takeEvery(SAVE_SCREENING, saveScreeningCard))
  })
})

describe('saveScreeningCard', () => {
  it('saves allegations edits and puts screening', () => {
    const action = saveCard(allegationsCardName)
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
    const action = saveCard(screeningInformationCardName)
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
    const action = saveCard(narrativeCardName)
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
    const action = saveCard(incidentInformationCardName)
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
    const action = saveCard(workerSafetyCardName)
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
    const action = saveCard(crossReportsCardName)
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
    const action = saveCard(decisionCardName)
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
    const action = saveCard(allegationsCardName)
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

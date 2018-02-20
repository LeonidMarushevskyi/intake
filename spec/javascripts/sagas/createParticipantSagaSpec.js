import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createParticipant,
  createParticipantSaga,
} from 'sagas/createParticipantSaga'
import {CREATE_PERSON} from 'actions/personCardActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import * as personCardActions from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationships} from 'actions/relationshipsActions'

describe('createParticipantSaga', () => {
  it('creates participant on CREATE_PERSON', () => {
    const gen = createParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(CREATE_PERSON, createParticipant))
  })
})

describe('createParticipant', () => {
  const params = {screening_id: '1', legacy_descriptor: {legacy_id: '1', legacy_table_name: 'table'}}
  const participant = {first_name: 'Michael', ...params}
  const action = personCardActions.createPerson(participant)

  it('creates and puts participant and fetches relationships and history', () => {
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', {participant: params}))
    expect(gen.next(participant).value).toEqual(
      put(personCardActions.createPersonSuccess(participant))
    )
    expect(gen.next().value).toEqual(
      select(getScreeningIdValueSelector)
    )
    const screeningId = '444'
    expect(gen.next(screeningId).value).toEqual(
      put(fetchRelationships('screenings', screeningId))
    )
    expect(gen.next(screeningId).value).toEqual(
      put(fetchHistoryOfInvolvements('screenings', screeningId))
    )
  })

  it('puts errors when non-403 errors are thrown', () => {
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', {participant: params}))
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(personCardActions.createPersonFailure('some error'))
    )
  })

  it('calls an alert when the error status is 403', () => {
    const gen = createParticipant(action)
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', {participant: params}))
    const error = {responseJSON: 'some error', status: 403}
    expect(gen.throw(error).value).toEqual(
      call(alert, 'You are not authorized to add this person.')
    )
  })
})

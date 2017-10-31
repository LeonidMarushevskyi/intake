import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createParticipant,
  createParticipantSaga,
} from 'sagas/createParticipantSaga'
import {CREATE_PARTICIPANT} from 'actions/actionTypes'
import {
  createParticipantSuccess,
  createParticipantFailure,
  fetchRelationships,
} from 'actions/screeningActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'

describe('createParticipantSaga', () => {
  it('creates participant on CREATE_PARTICIPANT', () => {
    const gen = createParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(CREATE_PARTICIPANT, createParticipant))
  })
})

describe('createParticipant', () => {
  it('creates and puts participant and fetches relationships', () => {
    const participant = {first_name: 'Michael'}
    const gen = createParticipant({participant})
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', participant))
    expect(gen.next(participant).value).toEqual(
      put(createParticipantSuccess(participant))
    )
    expect(gen.next().value).toEqual(
      select(getScreeningIdValueSelector)
    )
    const screeningId = '444'
    expect(gen.next(screeningId).value).toEqual(
      put(fetchRelationships(screeningId))
    )
  })

  it('puts errors when errors are thrown', () => {
    const participant = {first_name: 'Michael'}
    const error = {responseJSON: 'some error'}
    const gen = createParticipant({participant})
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', participant))
    expect(gen.throw(error).value).toEqual(
      put(createParticipantFailure('some error'))
    )
  })
})

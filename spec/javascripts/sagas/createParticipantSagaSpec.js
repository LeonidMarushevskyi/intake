import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createParticipant,
  createParticipantSaga,
} from 'sagas/createParticipantSaga'
import {CREATE_PARTICIPANT} from 'actions/actionTypes'
import {
  createParticipantSuccess,
  createParticipantFailure,
} from 'actions/screeningActions'

describe('createParticipantSaga', () => {
  it('creates participant on CREATE_PARTICIPANT', () => {
    const gen = createParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(CREATE_PARTICIPANT, createParticipant))
  })
})

describe('createParticipant', () => {
  it('creates and puts participant', () => {
    const participant = {first_name: 'Michael'}
    const gen = createParticipant({participant})
    expect(gen.next().value).toEqual(call(post, '/api/v1/participants', participant))
    expect(gen.next(participant).value).toEqual(
      put(createParticipantSuccess(participant))
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

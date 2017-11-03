import {getErrorsSelector} from 'selectors/screeningInformationSelectors'
import {fromJS, List} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import moment from 'moment'

describe('screeningInformationSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getErrorsSelector', () => {
    describe('assignee', () => {
      it('returns an error if empty', () => {
        const screening = {assignee: ''}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('assignee'))
          .toEqualImmutable(List(['Please enter an assigned worker.']))
      })

      it('returns no errors if present', () => {
        const screening = {assignee: 'a sample assignee'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('assignee'))
          .toEqualImmutable(List([]))
      })
    })

    describe('communication_method', () => {
      it('returns an error if empty', () => {
        const screening = {communication_method: ''}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('communication_method'))
          .toEqualImmutable(List(['Please select a communication method.']))
      })

      it('returns no errors if present', () => {
        const screening = {communication_method: 'a sample communication_method'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('communication_method'))
          .toEqualImmutable(List([]))
      })
    })

    describe('ended_at', () => {
      it('returns an object with an empty array when no errors are present', () => {
        const yesterday = moment().subtract(1, 'days').toISOString()
        const screening = {ended_at: yesterday}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('ended_at'))
          .toEqualImmutable(List())
      })

      it('returns an error if date is in the future', () => {
        const tomorrow = moment().add(1, 'days').toISOString()
        const screening = {ended_at: tomorrow}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('ended_at'))
          .toEqualImmutable(List(['The end date and time cannot be in the future.']))
      })
    })

    describe('started_at', () => {
      it('returns an object with an empty array when no errors are present', () => {
        const yesterday = moment().subtract(1, 'days').toISOString()
        const screening = {started_at: yesterday}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List())
      })

      it('returns an error if missing', () => {
        const screening = {}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['Please enter a screening start date.']))
      })

      it('returns an error if an empty string', () => {
        const screening = {started_at: ''}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['Please enter a screening start date.']))
      })

      it('returns an error if date is in the future', () => {
        const tomorrow = moment().add(1, 'days').toISOString()
        const screening = {started_at: tomorrow}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['The start date and time cannot be in the future.']))
      })

      it('returns an error if date is after the end date', () => {
        const screening = {
          started_at: '2017-10-05T21:10:00.000',
          ended_at: '2017-10-04T21:10:00.012',
        }
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(
            List(['The start date and time must be before the end date and time.'])
          )
      })
    })
  })
})

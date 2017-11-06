import {getVisibleErrorsSelector} from 'selectors/screeningInformationFormSelectors'
import {fromJS, List} from 'Immutable'
import * as matchers from 'jasmine-immutable-matchers'
import moment from 'moment'

describe('screeningInformationFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getVisibleErrorsSelector', () => {
    describe('assignee', () => {
      it('returns an error if empty and touched', () => {
        const screeningInformationForm = {
          assignee: {value: '', touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('assignee'))
          .toEqualImmutable(List(['Please enter an assigned worker.']))
      })

      it('returns no errors if present and touched', () => {
        const screeningInformationForm = {
          assignee: {value: 'a sample assignee', touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('assignee'))
          .toEqualImmutable(List([]))
      })
    })

    describe('communication_method', () => {
      it('returns an error if empty and touched', () => {
        const screeningInformationForm = {
          communication_method: {value: '', touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('communication_method'))
          .toEqualImmutable(List(['Please select a communication method.']))
      })

      it('returns no errors if present and touched', () => {
        const screeningInformationForm = {
          communication_method: {value: 'a sample communication_method', touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('communication_method'))
          .toEqualImmutable(List([]))
      })
    })

    describe('ended_at', () => {
      it('returns an object with an empty array when no errors are present', () => {
        const yesterday = moment().subtract(1, 'days').toISOString()
        const screeningInformationForm = {
          ended_at: {value: yesterday, touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('ended_at'))
          .toEqualImmutable(List())
      })

      it('returns an error if date is in the future and touched', () => {
        const tomorrow = moment().add(1, 'days').toISOString()
        const screeningInformationForm = {
          ended_at: {value: tomorrow, touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('ended_at'))
          .toEqualImmutable(List(['The end date and time cannot be in the future.']))
      })
    })

    describe('started_at', () => {
      it('returns an object with an empty array when no errors are present', () => {
        const yesterday = moment().subtract(1, 'days').toISOString()
        const screeningInformationForm = {
          started_at: {value: yesterday, touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List())
      })

      it('returns an error if an empty string and touched', () => {
        const screeningInformationForm = {
          started_at: {value: '', touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['Please enter a screening start date.']))
      })

      it('returns an error if date is in the future and touched', () => {
        const tomorrow = moment().add(1, 'days').toISOString()
        const screeningInformationForm = {
          started_at: {value: tomorrow, touched: true},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['The start date and time cannot be in the future.']))
      })

      it('returns an error if date is after the end date and touched', () => {
        const screeningInformationForm = {
          started_at: {value: '2017-10-05T21:10:00.000', touched: true},
          ended_at: {value: '2017-10-04T21:10:00.012'},
        }
        const state = fromJS({screeningInformationForm})
        expect(getVisibleErrorsSelector(state).get('started_at'))
          .toEqualImmutable(
            List(['The start date and time must be before the end date and time.'])
          )
      })
    })
  })
})

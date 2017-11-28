import {fromJS, List} from 'immutable'
import {
  getHasGenericErrorValueSelector,
  getScreeningSubmissionErrorsSelector,
  getTotalScreeningSubmissionErrorValueSelector,
} from 'selectors/errorsSelectors'
import {SUBMIT_SCREENING_COMPLETE} from 'actions/actionTypes'
import * as matchers from 'jasmine-immutable-matchers'

describe('errorsSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getHasGenericErrorValueSelector', () => {
    it('returns true when unknown errors exist', () => {
      const errors = {UNKNOWN_ACTION_TYPE: 'error'}
      const state = fromJS({errors})
      expect(getHasGenericErrorValueSelector(state)).toEqualImmutable(true)
    })
    it('returns false when unknown errors do not exist', () => {
      const errors = {}
      const state = fromJS({errors})
      expect(getHasGenericErrorValueSelector(state)).toEqualImmutable(false)
    })
  })
  describe('getTotalScreeningSubmissionErrorValueSelector', () => {
    it('returns count of screening submission errors', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'GVR_ENTC sys code is required',
          property: 'incidentCounty.GVR_ENTC',
        },
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'must contain at least one victim, only one reporter, and ...',
          property: 'participants',
        },
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'must be greater than or equal to 1',
          property: 'id',
          invalid_value: 0,
        },
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'may not be null',
          property: 'responseTime',
        },
      ]}
      const state = fromJS({errors})
      expect(getTotalScreeningSubmissionErrorValueSelector(state)).toEqualImmutable(4)
    })
    it('returns 0 when no screening submission errors exist', () => {
      const state = fromJS({errors: {}})
      expect(getTotalScreeningSubmissionErrorValueSelector(state)).toEqualImmutable(0)
    })
  })
  describe('getScreeningSubmissionErrorsSelector', () => {
    it('returns count of screening submission errors', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'GVR_ENTC sys code is required',
          property: 'incidentCounty.GVR_ENTC',
        },
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'must contain at least one victim, only one reporter, and ...',
          property: 'participants',
        },
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'must be greater than or equal to 1',
          property: 'id',
          invalid_value: 0,
        },
        {
          incident_id: '0de2aea9-04f9-4fc4-bc16-75b6495839e0',
          type: 'constraint_validation',
          user_message: 'may not be null',
          property: 'responseTime',
        },
      ]}
      const state = fromJS({errors})
      expect(getScreeningSubmissionErrorsSelector(state)).toEqualImmutable(fromJS([
        'incidentCounty.GVR_ENTC GVR_ENTC sys code is required (Incident Id: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
        'participants must contain at least one victim, only one reporter, and ... (Incident Id: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
        'id must be greater than or equal to 1 (Incident Id: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
        'responseTime may not be null (Incident Id: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
      ]))
    })
    it('returns 0 when no screening submission errors exist', () => {
      const state = fromJS({errors: {}})
      expect(getScreeningSubmissionErrorsSelector(state)).toEqualImmutable(List())
    })
  })
})

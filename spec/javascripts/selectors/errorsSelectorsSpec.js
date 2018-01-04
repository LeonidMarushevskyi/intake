import {fromJS} from 'immutable'
import {
  getHasGenericErrorValueSelector,
  getScreeningSubmissionErrorsSelector,
  getApiValidationErrorsSelector,
  getSystemErrorsSelector,
  getSystemErrorIncidentIdsSelector,
  getPageErrorMessageValueSelector,
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
        'incidentCounty.GVR_ENTC GVR_ENTC sys code is required (Ref #: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
        'participants must contain at least one victim, only one reporter, and ... (Ref #: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
        'id must be greater than or equal to 1 (Ref #: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
        'responseTime may not be null (Ref #: 0de2aea9-04f9-4fc4-bc16-75b6495839e0)',
      ]))
    })
    it('returns 0 when no screening submission errors exist', () => {
      const state = fromJS({errors: {}})
      expect(getScreeningSubmissionErrorsSelector(state)).toEqualImmutable(fromJS([]))
    })
  })
  describe('getApiValidationErrorsSelector', () => {
    it('returns errors with type equal to "constraint_validation"', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '1',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '2',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '3',
          type: 'constraint_validation',
        },
        {
          incident_id: '4',
          type: 'constraint_validation',
        },
      ]}
      const state = fromJS({errors})
      expect(getApiValidationErrorsSelector(state)).toEqualImmutable(fromJS([
        {
          incident_id: '3',
          type: 'constraint_validation',
        },
        {
          incident_id: '4',
          type: 'constraint_validation',
        },
      ]))
    })
  })
  describe('getSystemErrorsSelector', () => {
    it('returns errors with type not equal to "constraint_validation"', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '1',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '2',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '3',
          type: 'constraint_validation',
        },
        {
          incident_id: '4',
          type: 'constraint_validation',
        },
      ]}
      const state = fromJS({errors})
      expect(getSystemErrorsSelector(state)).toEqualImmutable(fromJS([
        {
          incident_id: '1',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '2',
          type: 'not_constraint_validation',
        },
      ]))
    })
  })
  describe('getSystemErrorIncidentIdsSelector', () => {
    it('returns a comma separated string of systemErrors incident ids', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '1',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '2',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '3',
          type: 'constraint_validation',
        },
        {
          incident_id: '4',
          type: 'constraint_validation',
        },
      ]}
      const state = fromJS({errors})
      expect(getSystemErrorIncidentIdsSelector(state)).toEqualImmutable(fromJS(['1', '2']))
    })
  })
  describe('getPageErrorMessageSelector', () => {
    it('returns apiValidationErrors if it exists', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '1',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '2',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '3',
          type: 'constraint_validation',
        },
        {
          incident_id: '4',
          type: 'constraint_validation',
        },
      ]}
      const state = fromJS({errors})
      expect(getPageErrorMessageValueSelector(state)).toEqual('2 error(s) have been identified. Please fix them and try submitting again.')
    })
    it('returns a system error with incident ids if systemErrorIncidentIds exists and apiValidationErrors is null', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: [
        {
          incident_id: '1',
          type: 'not_constraint_validation',
        },
        {
          incident_id: '2',
          type: 'not_constraint_validation',
        },
      ]}
      const state = fromJS({errors})
      expect(getPageErrorMessageValueSelector(state)).toEqual('Something went wrong, sorry! Please try your last action again. (Ref #: 1, 2)')
    })
    it('returns a generic error message if no incident ids exists', () => {
      expect(getPageErrorMessageValueSelector(fromJS({[SUBMIT_SCREENING_COMPLETE]: []}))).toEqual('Something went wrong, sorry! Please try your last action again.')
    })
  })
})

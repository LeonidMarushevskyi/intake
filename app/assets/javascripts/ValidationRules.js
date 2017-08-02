import Immutable from 'immutable'

const VALIDATIONS = Object.freeze({
  decision_card: {
    screening_decision: [{
      rule: 'isInvalidIf',
      condition: (value, validator) => (
        value === 'promote_to_referral' && !validator.areValidAllegationsPresent()
      ),
      message: 'Please enter at least one allegation to promote to referral.',
    }, {
      rule: 'isRequired',
      message: 'Please enter a decision',
    }],
    screening_decision_detail: [{
      rule: 'isRequiredIf',
      condition: (_value, validator) => (
        validator.screening.get('screening_decision') === 'promote_to_referral'
      ),
      message: 'Please enter a response time',
    }],
  },
  incident_information_card: {
    incident_date: [{
      rule: 'isNotInTheFuture',
      message: 'The incident date and time cannot be in the future.',
    }],
  },
})

export default Immutable.fromJS(VALIDATIONS)

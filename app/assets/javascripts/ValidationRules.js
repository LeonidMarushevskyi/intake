import Immutable from 'immutable'

const VALIDATIONS = Object.freeze({
  decision_card: {
    screening_decision: [{
      rule: 'isInvalidIf',
      condition: (value, validator) => (
        value === 'promote_to_referral' && !validator.areValidAllegationsPresent()
      ), message: 'Please enter at least one allegation to promote to referral.',
    }],
  },
})

export default Immutable.fromJS(VALIDATIONS)

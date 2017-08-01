import Immutable from 'immutable'

const VALIDATIONS = Object.freeze({
  decision_card: {
    screening_decision: [{
      rule: 'isInvalidIf',
      condition: (value) => (
        value === 'promote_to_referral' //&& !this.props.areValidAllegationsPresent
      ), message: 'Please enter at least one allegation to promote to referral.',
    }],
  },
})

export default Immutable.fromJS(VALIDATIONS)

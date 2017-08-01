import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import DecisionEditView from 'components/screenings/DecisionEditView'
import DecisionShowView from 'components/screenings/DecisionShowView'
import * as Validator from 'utils/validator'

export default class DecisionCardView extends React.Component {
  constructor(props) {
    super(props)

    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.validateField = this.validateField.bind(this)

    this.fields = Immutable.fromJS(['screening_decision_detail', 'screening_decision', 'additional_information'])
    this.fieldValidations = Immutable.fromJS({
      screening_decision: [{
        rule: 'isInvalidIf',
        condition: (value) => (
          value === 'promote_to_referral' && !this.props.areValidAllegationsPresent
        ), message: 'Please enter at least one allegation to promote to referral.',
      }],
    })

    let errors
    if (this.props.mode === 'show') {
      errors = Validator.validateAllFields({screening: this.props.screening, fieldValidations: this.fieldValidations})
    } else {
      errors = Immutable.Map()
    }

    this.state = {
      errors: errors,
      mode: this.props.mode,
    }
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.fields)
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show'})
    })
  }

  validateField(fieldName, value) {
    const rules = this.fieldValidations.get(fieldName)
    const errors = this.state.errors.set(fieldName, Validator.validateField({rules, value}))
    this.setState({errors: errors})
  }

  render() {
    const {mode, errors} = this.state
    const allProps = {
      edit: {
        errors: errors,
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
        validateField: this.validateField,
      },
      show: {
        errors: errors,
        onEdit: this.onEdit,
        screening: this.props.screening,
      },
    }
    const DecisionView = (mode === 'edit') ? DecisionEditView : DecisionShowView
    const props = allProps[mode]
    return <DecisionView {...props} />
  }
}

DecisionCardView.propTypes = {
  areValidAllegationsPresent: PropTypes.bool.isRequired,
  mode: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

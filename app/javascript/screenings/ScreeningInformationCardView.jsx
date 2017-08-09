import * as Validator from 'utils/validator'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningInformationEditView from 'screenings/ScreeningInformationEditView'
import ScreeningInformationShowView from 'screenings/ScreeningInformationShowView'

export default class ScreeningInformationCardView extends React.Component {
  constructor(props) {
    super(props)

    this.validateOnChange = this.validateOnChange.bind(this)
    this.validateField = this.validateField.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)

    this.fieldValidations = Immutable.fromJS({
      assignee: [
        {rule: 'isRequired', message: 'Please enter an assigned worker.'},
      ],
      communication_method: [
        {rule: 'isRequired', message: 'Please select a communication method.'},
      ],
      ended_at: [
        {rule: 'isNotInTheFuture', message: 'The end date and time cannot be in the future.'},
      ],
      name: [],
      started_at: [
        {rule: 'isRequired', message: 'Please enter a screening start date.'},
        {rule: 'isNotInTheFuture', message: 'The start date and time cannot be in the future.'},
        {
          rule: 'isBeforeOtherDate',
          message: 'The start date and time must be before the end date and time.',
          otherValue: () => (this.props.screening.get('ended_at')),
        },
      ],
    })

    this.fields = Immutable.List(this.fieldValidations.keys())

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

  validateOnChange(fieldName, value) {
    const errors = this.state.errors.get(fieldName)
    if (errors && !errors.isEmpty()) {
      this.validateField(fieldName, value)
    }
    this.props.onChange([fieldName], value)
  }

  validateField(fieldName, value) {
    const rules = this.fieldValidations.get(fieldName)
    const errors = this.state.errors.set(fieldName, Validator.validateField({rules, value}))
    this.setState({errors: errors})
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onSave() {
    const errors = Validator.validateAllFields({screening: this.props.screening, fieldValidations: this.fieldValidations})
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show', errors: errors})
    })
  }

  onCancel() {
    const errors = Validator.validateAllFields({screening: this.props.screening, fieldValidations: this.fieldValidations})
    this.setState({mode: 'show', errors: errors})
    this.props.onCancel(this.fields)
  }

  render() {
    const {errors, mode} = this.state
    const allprops = {
      edit: {
        errors: errors,
        validateOnChange: this.validateOnChange,
        validateField: this.validateField,
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
      },
      show: {
        onEdit: this.onEdit,
        screening: this.props.screening,
        errors: errors,
      },
    }
    const ScreeningInformationView = (mode === 'edit') ? ScreeningInformationEditView : ScreeningInformationShowView
    const props = allprops[mode]
    return <ScreeningInformationView {...props} />
  }
}

ScreeningInformationCardView.propTypes = {
  mode: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

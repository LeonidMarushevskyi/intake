import * as Validator from 'utils/validator'
import Immutable from 'immutable'
import NarrativeEditView from 'screenings/NarrativeEditView'
import NarrativeShowView from 'screenings/NarrativeShowView'
import PropTypes from 'prop-types'
import React from 'react'

export default class NarrativeCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.onBlur = this.onBlur.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.validateField = this.validateField.bind(this)
    this.fieldValidations = Immutable.fromJS({
      report_narrative: [
        {rule: 'isRequired', message: 'Please enter a narrative.'},
      ],
    })

    this.fields = Immutable.List(this.fieldValidations.keys())

    let errors = Immutable.Map()
    if (this.props.mode === 'show') {
      errors = Validator.validateAllFields({screening: this.props.screening, fieldValidations: this.fieldValidations})
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
    const errors = Validator.validateAllFields({screening: this.props.screening, fieldValidations: this.fieldValidations})
    this.setState({mode: 'show', errors: errors})
    this.props.onCancel(this.fields)
  }

  validateField(fieldName, value) {
    const rules = this.fieldValidations.get(fieldName)
    const errors = this.state.errors.set(fieldName, Validator.validateField({rules, value}))
    this.setState({errors: errors})
  }

  onChange(fieldSeq, value, callback) {
    fieldSeq.map((fieldName) => {
      const errors = this.state.errors.get(fieldName)
      if (errors && !errors.isEmpty()) {
        this.validateField(fieldName, value)
      }
    })
    this.props.onChange(fieldSeq, value, callback)
  }

  onBlur(event) {
    this.setState({
      errors: Validator.validateAllFields({
        screening: Immutable.fromJS({report_narrative: event.target.value}),
        fieldValidations: this.fieldValidations,
      }),
    })
  }

  onSave() {
    const errors = Validator.validateAllFields({screening: this.props.screening, fieldValidations: this.fieldValidations})
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show', errors: errors})
    })
  }

  render() {
    const {errors, mode} = this.state
    const allProps = {
      edit: {
        errors: errors,
        screening: this.props.screening,
        onBlur: this.onBlur,
        onCancel: this.onCancel,
        onChange: this.onChange,
        onSave: this.onSave,
      },
      show: {
        errors: errors,
        screening: this.props.screening,
        onEdit: this.onEdit,
      },
    }
    const NarrativeView = (mode === 'edit') ? NarrativeEditView : NarrativeShowView
    const props = allProps[mode]
    return <NarrativeView {...props} />
  }
}

NarrativeCardView.propTypes = {
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

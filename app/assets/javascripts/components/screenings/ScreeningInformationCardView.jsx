import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import ScreeningInformationShowView from 'components/screenings/ScreeningInformationShowView'
import * as Validator from 'utils/validator'

export default class ScreeningInformationCardView extends React.Component {
  constructor(props) {
    super(props)

    this.onBlur = this.onBlur.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)

    this.fieldValidations = Immutable.fromJS({
      assignee: [{rule: 'isRequired', message: 'Please enter an assigned worker.'}],
      communication_method: [{rule: 'isRequired', message: 'Please select a communication method.'}],
      ended_at: [],
      name: [],
      started_at: [],
    })

    this.fields = Immutable.List(this.fieldValidations.keys())

    let errors
    if (this.props.mode === 'show') {
      errors = this.validateAllFields()
    } else {
      errors = Immutable.Map()
    }

    this.state = {
      errors: errors,
      mode: this.props.mode,
    }
  }

  validateAllFields() {
    const errors = {}
    this.fieldValidations.map((rules, fieldShortName) => {
      errors[fieldShortName] = Validator.validateField({
        value: this.props.screening.get(fieldShortName),
        rules,
      })
    })
    return Immutable.Map(errors)
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onSave() {
    const errors = this.validateAllFields()
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show', errors: errors})
    })
  }

  onBlur(fieldName, value) {
    const rules = this.fieldValidations.get(fieldName)
    const errors = this.state.errors.set(fieldName, Validator.validateField({rules, value}))
    this.setState({errors: errors})
  }

  onCancel() {
    const errors = this.validateAllFields()
    this.setState({mode: 'show', errors: errors})
    this.props.onCancel(this.fields)
  }

  render() {
    const {errors, mode} = this.state
    const allprops = {
      edit: {
        errors: errors,
        onBlur: this.onBlur,
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


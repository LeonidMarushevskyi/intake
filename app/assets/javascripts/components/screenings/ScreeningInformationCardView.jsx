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
      assignee: {
        friendlyName: 'Assigned Social Worker',
        rules: ['isRequired'],
      }, communication_method: {
        friendlyName: 'Communication Method',
        rules: [],
      }, ended_at: {
        friendlyName: 'Screening End Date/Time',
        rules: [],
      }, name: {
        friendlyName: 'Title/Name of Screening',
        rules: [],
      }, started_at: {
        friendlyName: 'Screening Start Date/Time',
        rules: [],
      },
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
    this.fieldValidations.map((args, fieldShortName) => {
      errors[fieldShortName] = Validator.validateField({
        friendlyName: args.get('friendlyName'),
        value: this.props.screening.get(fieldShortName),
        rules: args.get('rules'),
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
    const friendlyName = this.fieldValidations.get(fieldName).get('friendlyName')
    const rules = this.fieldValidations.get(fieldName).get('rules')

    const errors = this.state.errors.set(fieldName, Validator.validateField({friendlyName, rules, value}))
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


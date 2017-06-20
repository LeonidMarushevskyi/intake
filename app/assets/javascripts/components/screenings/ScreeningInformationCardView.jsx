import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningInformationEditView from 'components/screenings/ScreeningInformationEditView'
import ScreeningInformationShowView from 'components/screenings/ScreeningInformationShowView'

export default class ScreeningInformationCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: Immutable.Map(),
      mode: this.props.mode,
    }
    this.onBlur = this.onBlur.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.fields = Immutable.fromJS([
      'assignee',
      'communication_method',
      'ended_at',
      'name',
      'started_at',
    ])
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show'})
    })
  }

  onBlur(fieldName, _value) {
    // Validate field with the validation service
    const errors = this.state.errors.set(fieldName, Immutable.List(['Error 1', 'Error 2']))
    this.setState({errors: errors})
  }

  onCancel() {
    this.setState({mode: 'show'})
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


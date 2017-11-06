import Immutable from 'immutable'
import IncidentInformationEditView from 'screenings/IncidentInformationEditView'
import IncidentInformationShowContainer from 'containers/screenings/incidentInformation/IncidentInformationShowContainer'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

export default class IncidentInformationCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onBlur = this.onBlur.bind(this)

    this.fields = Immutable.fromJS([
      'address',
      'incident_county',
      'incident_date',
      'location_type',
    ])

    let displayErrorsFor
    if (this.props.mode === 'show') {
      displayErrorsFor = this.fields
    } else {
      displayErrorsFor = Immutable.List()
    }

    this.state = {
      mode: this.props.mode,
      displayErrorsFor: displayErrorsFor,
    }
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.fields)
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show', displayErrorsFor: this.fields})
    })
  }

  onBlur(fieldName) {
    const displayErrorsFor = this.state.displayErrorsFor.push(fieldName)
    this.setState({displayErrorsFor: displayErrorsFor})
  }

  filteredErrors() {
    return this.props.errors.filter((_value, key) => (
      this.state.displayErrorsFor.includes(key)
    )).toJS()
  }

  render() {
    const {mode} = this.state
    const errors = this.filteredErrors()
    const allProps = {
      edit: {
        errors: errors,
        onBlur: this.onBlur,
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
      },
      show: {
        errors: errors,
        onEdit: this.onEdit,
        screening: this.props.screening,
      },
    }
    const IncidentInformationView = (mode === 'edit') ? IncidentInformationEditView : IncidentInformationShowContainer
    const props = allProps[mode]
    return (
      <div className={`card ${mode} double-gap-top`} id='incident-information-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Incident Information'
          showEdit={this.props.editable && mode === 'show'}
        />
        <IncidentInformationView {...props} />
      </div>
    )
  }
}

IncidentInformationCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

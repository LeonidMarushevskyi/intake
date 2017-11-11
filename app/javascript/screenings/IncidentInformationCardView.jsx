import Immutable from 'immutable'
import IncidentInformationShowContainer from 'containers/screenings/IncidentInformationShowContainer'
import IncidentInformationFormContainer from 'containers/screenings/IncidentInformationFormContainer'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

export default class IncidentInformationCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.onEdit = this.onEdit.bind(this)
    this.toggleShow = this.toggleShow.bind(this)

    this.fields = Immutable.fromJS([
      'address',
      'incident_county',
      'incident_date',
      'location_type',
    ])

    const displayErrorsFor = this.fields

    this.state = {
      mode: this.props.mode,
      displayErrorsFor: displayErrorsFor,
    }
  }

  toggleShow() {
    this.setState({mode: 'show'})
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  filteredErrors() {
    return this.props.errors.filter((_value, key) => (
      this.state.displayErrorsFor.includes(key)
    )).toJS()
  }

  render() {
    const {mode} = this.state
    const errors = this.filteredErrors()
    const IncidentInformationView = (mode === 'edit') ? IncidentInformationFormContainer : IncidentInformationShowContainer
    return (
      <div className={`card ${mode} double-gap-top`} id='incident-information-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Incident Information'
          showEdit={this.props.editable && mode === 'show'}
        />
        <IncidentInformationView errors={errors} toggleShow={this.toggleShow} />
      </div>
    )
  }
}

IncidentInformationCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['edit', 'show']),
}

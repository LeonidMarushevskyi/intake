import PersonCardContainer from 'containers/screenings/PersonCardContainer'
import PersonDemographicsFormContainer from 'containers/screenings/PersonDemographicsFormContainer'
import PersonPhoneNumbersContainer from 'containers/screenings/PersonPhoneNumbersContainer'
import PersonPhoneNumbersFormContainer from 'containers/screenings/PersonPhoneNumbersFormContainer'
import PersonShowContainer from 'containers/screenings/PersonShowContainer'
import PersonAddressesContainer from 'containers/screenings/PersonAddressesContainer'
import PersonAddressesFormContainer from 'containers/screenings/PersonAddressesFormContainer'
import PersonFormContainer from 'containers/screenings/PersonFormContainer'
import PropTypes from 'prop-types'
import React from 'react'

export default class ParticipantCardView extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {mode: this.props.mode}
    this.toggleMode = this.toggleMode.bind(this)
  }

  toggleMode() {
    const currentMode = this.state.mode
    const newMode = currentMode === 'show' ? 'edit' : 'show'
    this.setState({mode: newMode})
  }

  render() {
    const {mode} = this.state
    const personId = this.props.participant.get('id')
    return (
      <PersonCardContainer
        mode={mode}
        toggleMode={this.toggleMode}
        personId={personId}
        edit={
          <div>
            <PersonFormContainer personId={personId} />
            <PersonDemographicsFormContainer personId={personId} />
            <PersonPhoneNumbersFormContainer personId={personId} />
            <PersonAddressesFormContainer personId={personId} />
          </div>
        }
        show={
          <div>
            <PersonShowContainer personId={personId} />
            <PersonPhoneNumbersContainer personId={personId} />
            <PersonAddressesContainer personId={personId} />
          </div>
        }
      />
    )
  }
}

ParticipantCardView.propTypes = {
  mode: PropTypes.oneOf(['edit', 'show']),
  participant: PropTypes.object.isRequired,
}

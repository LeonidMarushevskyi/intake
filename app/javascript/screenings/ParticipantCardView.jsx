import PersonCardContainer from 'containers/screenings/PersonCardContainer'
import PersonPhoneNumbersContainer from 'containers/screenings/PersonPhoneNumbersContainer'
import PersonPhoneNumbersFormContainer from 'containers/screenings/PersonPhoneNumbersFormContainer'
import PersonShowContainer from 'containers/screenings/PersonShowContainer'
import PersonAddressesContainer from 'containers/screenings/PersonAddressesContainer'
import PersonFormContainer from 'containers/screenings/PersonFormContainer'
import PropTypes from 'prop-types'
import React from 'react'

export default class ParticipantCardView extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      mode: this.props.mode,
    }

    this.toggleMode = this.toggleMode.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onDobBlur = this.onDobBlur.bind(this)
    this.onSave = this.onSave.bind(this)
    this.stripApproximateAge = this.stripApproximateAge.bind(this)
  }

  onCancel() {
    this.toggleMode()
    this.props.onCancel(this.props.participant.get('id'))
  }

  onSave() {
    const onlyNumbers = (number) => number.replace(/[^0-9]/g, '')
    const sanitizedParticipant = this.props.participant
      .update('phone_numbers', (phoneNumbers) =>
        phoneNumbers.map((phoneNumber) => phoneNumber.update('number', onlyNumbers)
        ))
    if (sanitizedParticipant.get('date_of_birth')) {
      this.props.onSave(this.stripApproximateAge(sanitizedParticipant))
    } else {
      this.props.onSave(sanitizedParticipant)
    }
    this.toggleMode()
  }

  onChange(fieldSeq, value) {
    const participant = this.props.participant.setIn(fieldSeq, value)
    this.props.onChange(this.props.participant.get('id'), participant)
  }

  onDobBlur(value) {
    if (value) {
      this.stripApproximateAge(this.props.participant)
    }
  }

  stripApproximateAge(participant) {
    const cleanedParticipant = participant.set('approximate_age', null).set('approximate_age_units', null)
    this.props.onChange(cleanedParticipant.get('id'), cleanedParticipant)
    return cleanedParticipant
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
            <PersonPhoneNumbersFormContainer personId={personId} />
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
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  participant: PropTypes.object.isRequired,
}

import * as IntakeConfig from 'common/config'
import nameFormatter from 'utils/nameFormatter'
import {participantFlag} from 'utils/accessIndicator'
import PersonCardHeader from 'views/people/PersonCardHeader'
import ParticipantEditView from 'screenings/ParticipantEditView'
import ParticipantShowView from 'screenings/ParticipantShowView'
import PropTypes from 'prop-types'
import React from 'react'

export default class ParticipantCardView extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      mode: this.props.mode,
    }

    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onDobBlur = this.onDobBlur.bind(this)
    this.onSave = this.onSave.bind(this)
    this.stripApproximateAge = this.stripApproximateAge.bind(this)
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
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
    this.setState({mode: 'show'})
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

  render() {
    const {mode} = this.state
    const {editable, participant} = this.props

    const sharedProps = {
      participant: participant,
    }

    const allProps = {
      edit: {
        ...sharedProps,
        onCancel: this.onCancel,
        onChange: this.onChange,
        onDobBlur: this.onDobBlur,
        onSave: this.onSave,
      },
      show: {
        ...sharedProps,
        onEdit: this.onEdit,
      },
    }

    const ParticipantView = (mode === 'edit') ? ParticipantEditView : ParticipantShowView
    const props = allProps[mode]
    const informationFlag = participantFlag(participant.toJS())
    return (
      <div className={`card ${mode} double-gap-top`} id={`participants-card-${participant.get('id')}`}>
        <PersonCardHeader
          informationFlag={informationFlag}
          onDelete={() => this.props.onDelete(participant.get('id'))}
          showDelete={editable}
          onEdit={this.onEdit}
          showEdit={editable && IntakeConfig.isFeatureInactive('release_two') && mode === 'show'}
          title={nameFormatter(participant.toJS())}
        />
        <ParticipantView {...props} />
      </div>
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

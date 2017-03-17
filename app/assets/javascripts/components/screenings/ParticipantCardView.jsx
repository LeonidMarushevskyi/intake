import ParticipantEditView from 'components/screenings/ParticipantEditView'
import ParticipantShowView from 'components/screenings/ParticipantShowView'
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
    this.onSave = this.onSave.bind(this)
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.props.participant.get('id'))
  }

  onSave() {
    this.props.onSave(this.props.participant)
    this.setState({mode: 'show'})
  }

  onChange(fieldSeq, value) {
    const participant = this.props.participant.setIn(fieldSeq, value)
    this.props.onChange(this.props.participant.get('id'), participant)
  }

  render() {
    const {mode} = this.state

    const sharedProps = {
      onDelete: this.props.onDelete,
      participant: this.props.participant,
    }

    const allProps = {
      edit: {
        onCancel: this.onCancel,
        onChange: this.onChange,
        onSave: this.onSave,
      },
      show: {
        onEdit: this.onEdit,
      },
    }

    const ParticipantView = (mode === 'edit') ? ParticipantEditView : ParticipantShowView
    const props = Object.assign(allProps[mode], sharedProps)
    return <ParticipantView {...props} />
  }
}

ParticipantCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  onCancel: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  participant: React.PropTypes.object.isRequired,
}

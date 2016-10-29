import React from 'react'
import ParticipantShowView from 'components/screenings/ParticipantShowView'
import ParticipantEditView from 'components/screenings/ParticipantEditView'

export default class ParticipantCardView extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  render() {
    const {mode} = this.state
    const {participant} = this.props
    let View
    if (mode === 'edit') {
      View = ParticipantEditView
    } else {
      View = ParticipantShowView
    }
    return (
      <View participant={participant} onEdit={this.onEdit} />
    )
  }
}

ParticipantCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  participant: React.PropTypes.object.isRequired,
}

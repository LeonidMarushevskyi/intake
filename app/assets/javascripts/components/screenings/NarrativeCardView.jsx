import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import NarrativeEditView from 'components/screenings/NarrativeEditView'

export default class NarrativeCardView extends React.Component {
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
    const {screening} = this.props
    let View
    if (mode === 'edit') {
      View = NarrativeEditView
    } else {
      View = NarrativeShowView
    }
    return (
      <View screening={this.props.screening} onEdit={this.onEdit} />
    )
  }
}

NarrativeCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  screening: React.PropTypes.object.isRequired,
}

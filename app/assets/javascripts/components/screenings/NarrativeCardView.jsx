import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import NarrativeEditView from 'components/screenings/NarrativeEditView'

export default class NarrativeCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
  }

  onSave() {
    this.setState({mode: 'show'})
  }

  render() {
    const {mode} = this.state
    const {screening} = this.props
    let view
    if (mode === 'edit') {
      view = (
        <NarrativeEditView screening={this.props.screening}
          onChange={() => null}
          onCancel={this.onCancel}
          onSave={this.onSave}
        />
      )
    } else {
      view = <NarrativeShowView screening={this.props.screening} onEdit={this.onEdit} />
    }
    return view
  }
}

NarrativeCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  screening: React.PropTypes.object.isRequired
}

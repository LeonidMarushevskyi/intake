import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import NarrativeEditView from 'components/screenings/NarrativeEditView'

export default class NarrativeCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.props.mode,
      narrative: this.props.narrative,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  onCancel(event) {
    event.preventDefault()
    this.setState({mode: 'show'})
  }

  onSave() {
    return this.props.onSave(this.state.narrative).then(() => {
      this.setState({mode: 'show'})
    })
  }

  onChange(value) {
    this.setState({narrative: value})
  }

  render() {
    const {mode} = this.state
    const {narrative} = this.props
    let narrativeView
    if (mode === 'edit') {
      narrativeView = (
        <NarrativeEditView
          onCancel={this.onCancel}
          onChange={this.onChange}
          onSave={this.onSave}
          narrative={this.state.narrative}
        />
      )
    } else {
      narrativeView = <NarrativeShowView narrative={this.props.narrative} onEdit={this.onEdit} />
    }
    return view
  }
}

NarrativeCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  onSave: React.PropTypes.func.isRequired,
  narrative: React.PropTypes.string.isRequired,
}

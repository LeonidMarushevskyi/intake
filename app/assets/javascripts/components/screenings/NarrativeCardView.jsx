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

  componentWillReceiveProps(nextProps) {
    this.setState({narrative: nextProps.narrative})
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
    this.setState({mode: 'show'})
    this.props.onSave(this.state.narrative)
  }

  onChange(value) {
    this.setState({narrative: value})
  }

  render() {
    const {mode} = this.state
    const {narrative} = this.props
    let view
    if (mode === 'edit') {
      view = (
        <NarrativeEditView
          onCancel={this.onCancel}
          onChange={this.onChange}
          onSave={this.onSave}
          narrative={this.state.narrative}
        />
      )
    } else {
      view = <NarrativeShowView narrative={this.props.narrative} onEdit={this.onEdit} />
    }
    return view
  }
}

NarrativeCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  onSave: React.PropTypes.func.isRequired,
  narrative: React.PropTypes.string.isRequired,
}

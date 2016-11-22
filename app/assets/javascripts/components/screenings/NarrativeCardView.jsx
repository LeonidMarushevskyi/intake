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
    const allProps = {
      edit: {
        onCancel: this.onCancel,
        onChange: this.onChange,
        onSave: this.onSave,
        narrative: this.state.narrative,
      },
      show: {
        narrative: this.props.narrative, onEdit: this.onEdit
      }
    }
    const NarrativeView = (mode === 'edit') ? NarrativeEditView : NarrativeShowView
    const props = allProps[mode]
    return <NarrativeView {...props} />
  }
}

NarrativeCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  onSave: React.PropTypes.func.isRequired,
  narrative: React.PropTypes.string.isRequired,
}

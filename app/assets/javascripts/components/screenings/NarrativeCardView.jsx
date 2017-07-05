import Immutable from 'immutable'
import NarrativeEditView from 'components/screenings/NarrativeEditView'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import PropTypes from 'prop-types'
import React from 'react'

export default class NarrativeCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.fields = Immutable.fromJS(['report_narrative'])
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.fields)
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show'})
    })
  }

  render() {
    const {mode} = this.state
    const allProps = {
      edit: {
        screening: this.props.screening,
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
      },
      show: {
        screening: this.props.screening,
        onEdit: this.onEdit,
      },
    }
    const NarrativeView = (mode === 'edit') ? NarrativeEditView : NarrativeShowView
    const props = allProps[mode]
    return <NarrativeView {...props} />
  }
}

NarrativeCardView.propTypes = {
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

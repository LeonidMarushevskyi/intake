import Immutable from 'immutable'
import React from 'react'
import WorkerSafetyEditView from 'components/screenings/WorkerSafetyEditView'
import WorkerSafetyShowView from 'components/screenings/WorkerSafetyShowView'

export default class WorkerSafetyCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.fields = Immutable.fromJS(['safety_alerts', 'safety_information'])
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
    const allprops = {
      show: {
        onEdit: this.onEdit,
      },
      edit: {
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
      },
    }
    const WorkerSafetyView = (mode === 'edit') ? WorkerSafetyEditView : WorkerSafetyShowView
    const props = {
      ...allprops[mode],
      safetyAlerts: this.props.screening.get('safety_alerts'),
      safetyInformation: this.props.screening.get('safety_information'),
    }
    return <WorkerSafetyView {...props} />
  }
}

WorkerSafetyCardView.propTypes = {
  mode: React.PropTypes.oneOf(['show', 'edit']),
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}

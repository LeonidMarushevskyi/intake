import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'
import WorkerSafetyShowView from 'screenings/WorkerSafetyShowView'
import WorkerSafetyEditView from 'screenings/WorkerSafetyEditView'

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

  onEdit() {
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
    return (
      <div className={`card ${mode} double-gap-top`} id='worker-safety-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Worker Safety'
          showEdit={this.props.editable && mode === 'show'}
        />
        <WorkerSafetyView {...props} />
      </div>
    )
  }
}

WorkerSafetyCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['show', 'edit']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

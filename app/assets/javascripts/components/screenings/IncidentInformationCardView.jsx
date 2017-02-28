import React from 'react'
import IncidentInformationShowView from 'components/screenings/IncidentInformationShowView'
import IncidentInformationEditView from 'components/screenings/IncidentInformationEditView'

export default class IncidentInformationCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)

    this.fields = [
      'address',
      'incident_county',
      'incident_date',
      'location_type',
      'response_time',
      'screening_decision',
    ]
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
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
      },
      show: {
        onEdit: this.onEdit,
        screening: this.props.screening,
      },
    }
    const IncidentInformationView = (mode === 'edit') ? IncidentInformationEditView : IncidentInformationShowView
    const props = allProps[mode]
    return <IncidentInformationView {...props} />
  }
}

IncidentInformationCardView.propTypes = {
  mode: React.PropTypes.oneOf(['edit', 'show']),
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}

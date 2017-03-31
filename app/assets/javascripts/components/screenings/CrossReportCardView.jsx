import CrossReportEditView from 'components/screenings/CrossReportEditView'
import CrossReportShowView from 'components/screenings/CrossReportShowView'
import Immutable from 'immutable'
import React from 'react'

export default class CrossReportCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)

    this.fields = Immutable.fromJS(['cross_reports'])
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
      edit: {
        crossReport: this.props.crossReport,
        onChange: this.props.onChange,
        onSave: this.onSave,
        onCancel: this.onCancel,
      },
      show: {
        onEdit: this.onEdit,
        crossReport: this.props.crossReport,
      },
    }
    const CrossReportView = (mode === 'edit') ? CrossReportEditView : CrossReportShowView
    const props = allprops[mode]
    return <CrossReportView {...props} />
  }
}

CrossReportCardView.propTypes = {
  crossReport: React.PropTypes.object,
  mode: React.PropTypes.oneOf(['edit', 'show']),
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
}

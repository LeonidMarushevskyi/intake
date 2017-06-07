import CrossReportEditView from 'components/screenings/CrossReportEditView'
import CrossReportShowView from 'components/screenings/CrossReportShowView'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
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
        crossReports: this.props.crossReports,
        onChange: this.props.onChange,
        onSave: this.onSave,
        onCancel: this.onCancel,
      },
      show: {
        onEdit: this.onEdit,
        crossReports: this.props.crossReports,
      },
    }
    const CrossReportView = (mode === 'edit') ? CrossReportEditView : CrossReportShowView
    const props = allprops[mode]
    return <CrossReportView {...props} />
  }
}

CrossReportCardView.propTypes = {
  crossReports: PropTypes.object,
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

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

  crossReportsInclude(agencyType) {
    const present = this.props.crossReports.some((crossReport) =>
      crossReport.get('agency_type') === agencyType
    )
    return present
  }

  infoMessage() {
    const infoMessage = 'Any report that includes allegations (except General Neglect or Caretaker Absence) must be cross-reported to law enforcement and the district attorney.'
    if (this.props.areCrossReportsRequired) {
      if (this.crossReportsInclude('District attorney') && this.crossReportsInclude('Law enforcement')) {
        return null
      } else {
        return infoMessage
      }
    } else {
      return null
    }
  }

  render() {
    const {mode} = this.state
    const infoMessage = this.infoMessage()
    const allprops = {
      edit: {
        areCrossReportsRequired: this.props.areCrossReportsRequired,
        crossReports: this.props.crossReports,
        infoMessage: infoMessage,
        onChange: this.props.onChange,
        onSave: this.onSave,
        onCancel: this.onCancel,
      },
      show: {
        crossReports: this.props.crossReports,
        infoMessage: infoMessage,
        onEdit: this.onEdit,
      },
    }
    const CrossReportView = (mode === 'edit') ? CrossReportEditView : CrossReportShowView
    const props = allprops[mode]
    return <CrossReportView {...props} />
  }
}

CrossReportCardView.defaultProps = {
  allegations: Immutable.fromJS([]),
}

CrossReportCardView.propTypes = {
  areCrossReportsRequired: PropTypes.bool,
  crossReports: PropTypes.object,
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

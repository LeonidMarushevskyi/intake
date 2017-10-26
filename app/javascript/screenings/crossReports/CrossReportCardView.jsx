import CrossReportFormContainer from 'screenings/crossReports/CrossReportFormContainer'
import CrossReportShowContainer from 'screenings/crossReports/CrossReportShowContainer'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

export default class CrossReportCardView extends React.Component {
  constructor(props) {
    super(props)
    this.toggleShow = this.toggleShow.bind(this)
    this.onEdit = this.onEdit.bind(this)

    this.state = {
      mode: this.props.mode,
    }
  }

  toggleShow() {
    this.setState({mode: 'show'})
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  render() {
    const {mode} = this.state
    return (
      <div className={`card ${mode} double-gap-top`} id='cross-report-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Cross Report'
          showEdit={this.props.editable && mode === 'show'}
        />
        {mode === 'edit' && <CrossReportFormContainer toggleShow={this.toggleShow} />}
        {mode === 'show' && <CrossReportShowContainer />}
      </div>
    )
  }
}

CrossReportCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['edit', 'show']),
}

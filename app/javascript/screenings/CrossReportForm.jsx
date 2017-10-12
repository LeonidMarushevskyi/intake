import React from 'react'
import PropTypes from 'prop-types'
import AlertInfoMessage from 'common/AlertInfoMessage'
import CountySelectField from 'common/CountySelectField'

class CrossReportForm extends React.Component {
  render() {
    const {actions: {fetchCountyAgencies, saveScreening, setField}} = this.props
    return (
      <div className='card-body no-pad-top'>
        { this.props.alertInfoMessage && <AlertInfoMessage message={this.props.alertInfoMessage} /> }
        <div className='row col-md-12'>
          <label>This report has cross reported to:</label>
        </div>
        <div className='row'>
          <CountySelectField
            gridClassName='col-md-6'
            id='cross_report_county'
            onChange={({target: {value}}) => {
              fetchCountyAgencies(value)
              setField('county', value)
            }}
            counties={this.props.counties}
            value={this.props.county}
          />
        </div>
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={() => saveScreening(this.props.screeningWithCrossReportEdits)}>Save</button>
            <button className='btn btn-default' >Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

CrossReportForm.propTypes = {
  actions: PropTypes.object.isRequired,
  alertInfoMessage: PropTypes.string,
  counties: PropTypes.array.isRequired,
  county: PropTypes.string,
  errors: PropTypes.object,
  screeningWithCrossReportEdits: PropTypes.object,
}

CrossReportForm.defaultProps = {
  alertInfoMessage: undefined,
  county: '',
  errors: {},
  screeningWithCrossReportEdits: {},
}

export default CrossReportForm

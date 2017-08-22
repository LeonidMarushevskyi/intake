import EditLink from 'common/EditLink'
import AlertInfoMessage from 'common/AlertInfoMessage'
import ErrorMessages from 'common/ErrorMessages'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'
import _ from 'lodash'
import {dateFormatter} from 'utils/dateFormatter'

export default class CrossReportShowView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const crossReports = this.props.crossReports.toJS()
    const hasCrossReports = !_.isEmpty(crossReports)
    const agencyTypeErrors = this.props.errors.toSet().flatMap((item) => item.get('agency_type'))
    const reportedOnErrors = this.props.errors.toSet().flatMap((item) => item.get('reported_on'))
    const communicationErrors = this.props.errors.toSet().flatMap((item) => item.get('communication_method'))
    let reportedOn
    let communicationMethod
    const [firstCrossReport] = crossReports
    if (firstCrossReport) {
      reportedOn = dateFormatter(firstCrossReport.reported_on)
      communicationMethod = firstCrossReport.communication_method
    }
    return (
      <div className='card show double-gap-top' id='cross-report-card'>
        <div className='card-header'>
          <span>Cross Report</span>
          <EditLink ariaLabel='Edit cross report' onClick={this.props.onEdit} />
        </div>
        <div className='card-body'>
          { this.props.alertInfoMessage && <AlertInfoMessage message={this.props.alertInfoMessage} /> }
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='This report has cross reported to:' errors={agencyTypeErrors}>
              {
                crossReports &&
                  <ul className='unstyled-list'>
                    {
                      crossReports.map(({agency_type, agency_name}, index) => {
                        const agencyTypeAndName = agency_name ? `${agency_type} - ${agency_name}` : agency_type
                        return (
                          <div key={index}>
                            <li>{agencyTypeAndName}</li>
                            <ErrorMessages errors={this.props.errors.getIn([agency_type, 'agency_name'])}/>
                          </div>
                        )
                      })
                    }
                  </ul>
              }
            </ShowField>
          </div>
          {
            firstCrossReport &&
              <div className='row'>
                <ShowField
                  errors={reportedOnErrors.toList()}
                  gridClassName='col-md-6'
                  label='Cross Reported on Date'
                  required={hasCrossReports}
                >
                  {reportedOn}
                </ShowField>
                <ShowField
                  errors={communicationErrors.toList()}
                  gridClassName='col-md-6'
                  label='Communication Method'
                  required={hasCrossReports}
                >
                  {communicationMethod}
                </ShowField>
              </div>
          }
        </div>
      </div>
    )
  }
}

CrossReportShowView.propTypes = {
  alertInfoMessage: PropTypes.string,
  crossReports: PropTypes.object,
  errors: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
}

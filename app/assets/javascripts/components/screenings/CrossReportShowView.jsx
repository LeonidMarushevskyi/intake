import EditLink from 'components/common/EditLink'
import InfoMessage from 'components/common/InfoMessage'
import ErrorMessages from 'components/common/ErrorMessages'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'components/common/ShowField'
import _ from 'lodash'
import {dateFormatter} from 'utils/dateFormatter'

export default class CrossReportShowView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const crossReports = this.props.crossReports.toJS()
    const hasCrossReports = !_.isEmpty(crossReports)
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
          { this.props.infoMessage && <InfoMessage message={this.props.infoMessage} /> }
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='This report has cross reported to:'>
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
  crossReports: PropTypes.object,
  errors: PropTypes.object.isRequired,
  infoMessage: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
}

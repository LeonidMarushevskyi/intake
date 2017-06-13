import EditLink from 'components/common/EditLink'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'components/common/ShowField'
import {dateFormatter} from 'utils/dateFormatter'
import _ from 'lodash'

export default class CrossReportShowView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const crossReports = this.props.crossReports.toJS()
    const hasCrossReports = !_.isEmpty(crossReports)
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
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='This report has cross reported to:'>
              {
                crossReports &&
                  <ul className='unstyled-list'>
                    {
                      crossReports.map(({agency_type, agency_name}, index) => {
                        const agencyTypeAndName = agency_name ? `${agency_type} - ${agency_name}` : agency_type
                        return (<li key={index}>{agencyTypeAndName}</li>)
                      })
                    }
                </ul>
              }
            </ShowField>
          </div>
          {
            firstCrossReport &&
              <div className='row'>
                <ShowField gridClassName='col-md-6' label='Cross Reported on Date' required={hasCrossReports}>{reportedOn}</ShowField>
                <ShowField gridClassName='col-md-6' label='Communication Method' required={hasCrossReports}>{communicationMethod}</ShowField>
              </div>
          }
        </div>
      </div>
    )
  }
}

CrossReportShowView.propTypes = {
  crossReports: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
}

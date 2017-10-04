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

  agencyTypeAndName(agency_type, agency_code) {
    const typeId = agency_type.replace(/ /gi, '_').toUpperCase()
    const agencies = this.props.countyAgencies[typeId]
    if (_.isEmpty(agencies)) {
      return agency_type
    } else {
      const filteredAgencies = agencies.filter((countyAgency) => countyAgency.id === agency_code)
      if (_.isEmpty(filteredAgencies)) {
        return agency_type
      } else {
        const agencyName = filteredAgencies[0].name
        return agencyName ? `${agency_type} - ${agencyName}` : agency_type
      }
    }
  }

  render() {
    const crossReports = this.props.crossReports.toJS()
    const hasCrossReports = !_.isEmpty(crossReports)
    const agencyTypeErrors = this.props.errors.toSet().flatMap((item) => item.get('agency_type')).toJS()
    const reportedOnErrors = this.props.errors.toSet().flatMap((item) => item.get('reported_on')).toJS()
    const communicationErrors = this.props.errors.toSet().flatMap((item) => item.get('communication_method')).toJS()
    let reportedOn
    let communicationMethod
    const [firstCrossReport] = crossReports
    if (firstCrossReport) {
      reportedOn = dateFormatter(firstCrossReport.reported_on)
      communicationMethod = firstCrossReport.communication_method
    }
    return (
      <div className='card-body'>
        { this.props.alertInfoMessage && <AlertInfoMessage message={this.props.alertInfoMessage} /> }
        <div className='row'>
          <ShowField gridClassName='col-md-12' label='This report has cross reported to:' errors={agencyTypeErrors}>
            {
              crossReports &&
                <ul className='unstyled-list'>
                  {
                    crossReports.map(({agency_type, agency_name}, index) => (
                      <div key={index}>
                        <li>{this.agencyTypeAndName(agency_type, agency_name)}</li>
                        <ErrorMessages
                          errors={this.props.errors.getIn([agency_type, 'agency_name']) && this.props.errors.getIn([agency_type, 'agency_name']).toJS()}
                        />
                      </div>
                    ))
                  }
                </ul>
            }
          </ShowField>
        </div>
        {
          firstCrossReport &&
            <div className='row'>
              <ShowField
                errors={reportedOnErrors}
                gridClassName='col-md-6'
                label='Cross Reported on Date'
                required={hasCrossReports}
              >
                {reportedOn}
              </ShowField>
              <ShowField
                errors={communicationErrors}
                gridClassName='col-md-6'
                label='Communication Method'
                required={hasCrossReports}
              >
                {communicationMethod}
              </ShowField>
            </div>
        }
      </div>
    )
  }
}

CrossReportShowView.propTypes = {
  alertInfoMessage: PropTypes.string,
  countyAgencies: PropTypes.object.isRequired,
  crossReports: PropTypes.object,
  errors: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
}

import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import AlertInfoMessage from 'common/AlertInfoMessage'
import ErrorMessages from 'common/ErrorMessages'
import {dateFormatter} from 'utils/dateFormatter'

const CrossReportShow = ({
  agencies,
  areCrossReportsRequired,
  alertInfoMessage,
  communicationMethod,
  errors,
  hasAgencies,
  hasCrossReport,
  reportedOn,
  requiredCrossReportErrors,
}) => (
  <div className='card-body'>
    { alertInfoMessage && <AlertInfoMessage message={alertInfoMessage} /> }
    <div className='row'>
      <ShowField gridClassName='col-md-12' label='This report has cross reported to:' errors={requiredCrossReportErrors} required={areCrossReportsRequired}>
        {
          hasCrossReport && hasAgencies &&
          <ul className='unstyled-list'>
            {
              Object.keys(agencies).map((type) => (
                <li key={type}>
                  {agencies[type]}
                  <ErrorMessages errors={errors[type]} />
                </li>
              ))
            }
          </ul>
        }
      </ShowField>
    </div>
    {
      hasCrossReport &&
      <div className='row'>
        <ShowField
          gridClassName='col-md-6'
          label='Cross Reported on Date'
          required={hasCrossReport}
          errors={errors.informDate}
        >
          {dateFormatter(reportedOn)}
        </ShowField>
        <ShowField
          gridClassName='col-md-6'
          label='Communication Method'
          required={hasCrossReport}
          errors={errors.method}
        >
          {communicationMethod}
        </ShowField>
      </div>
    }
  </div>
)

CrossReportShow.propTypes = {
  agencies: PropTypes.object.isRequired,
  alertInfoMessage: PropTypes.string,
  areCrossReportsRequired: PropTypes.bool.isRequired,
  communicationMethod: PropTypes.string,
  errors: PropTypes.object.isRequired,
  hasAgencies: PropTypes.bool.isRequired,
  hasCrossReport: PropTypes.bool.isRequired,
  reportedOn: PropTypes.string,
  requiredCrossReportErrors: PropTypes.array.isRequired,
}

export default CrossReportShow

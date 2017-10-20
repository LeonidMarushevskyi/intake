import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import AlertInfoMessage from 'common/alertInfoMessage'
import {dateFormatter} from 'utils/dateFormatter'

const CrossReportShow = ({
  agencies,
  alertInfoMessage,
  communicationMethod,
  hasAgencies,
  reportedOn,
}) => (
  <div className='card-body'>
    { alertInfoMessage && <AlertInfoMessage message={alertInfoMessage} /> }
    <div className='row'>
      <ShowField gridClassName='col-md-12' label='This report has cross reported to:' errors={[]}>
        {
          hasAgencies &&
          <ul className='unstyled-list'>
            {
              agencies.map((name, index) => (
                <li key={index}>{name}</li>
              ))
            }
          </ul>
        }
      </ShowField>
    </div>
    {
      hasAgencies &&
      <div className='row'>
        <ShowField
          gridClassName='col-md-6'
          label='Cross Reported on Date'
        >
          {dateFormatter(reportedOn)}
        </ShowField>
        <ShowField
          gridClassName='col-md-6'
          label='Communication Method'
        >
          {communicationMethod}
        </ShowField>
      </div>
    }
  </div>
)

CrossReportShow.propTypes = {
  agencies: PropTypes.array.isRequired,
  alertInfoMessage: PropTypes.string,
  communicationMethod: PropTypes.string,
  hasAgencies: PropTypes.bool.isRequired,
  reportedOn: PropTypes.string,
}

export default CrossReportShow

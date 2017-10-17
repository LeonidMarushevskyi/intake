import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import AlertInfoMessage from 'common/alertInfoMessage'
import {dateFormatter} from 'utils/dateFormatter'
import {AGENCY_TYPES} from 'enums/CrossReport'

const CrossReportShow = ({
  agencies,
  agencyCodeToName,
  alertInfoMessage,
  communicationMethod,
  reportedOn,
}) => (
  <div className='card-body'>
    { alertInfoMessage && <AlertInfoMessage message={alertInfoMessage} /> }
    <div className='row'>
      <ShowField gridClassName='col-md-12' label='This report has cross reported to:' errors={[]}>
        {
          agencies &&
            <ul className='unstyled-list'>
              {
                agencies.map(({id, type}, index) => (
                  <li key={index}>{id ? agencyCodeToName[id] || id : AGENCY_TYPES[type]}</li>
                ))
              }
            </ul>
        }
      </ShowField>
    </div>
    {
      agencies &&
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
  agencies: PropTypes.array,
  agencyCodeToName: PropTypes.object,
  alertInfoMessage: PropTypes.string,
  communicationMethod: PropTypes.string,
  reportedOn: PropTypes.string,
}

export default CrossReportShow

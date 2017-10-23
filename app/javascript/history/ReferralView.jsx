import React from 'react'
import PropTypes from 'prop-types'
import {dateRangeFormatter} from 'utils/dateFormatter'

const ReferralView = ({startDate, endDate, referralId, status, notification, county, peopleAndRoles}) => (
  <tr>
    <td>{dateRangeFormatter({start_date: startDate, end_date: endDate})}</td>
    <td>
      <div className='row referral'>Referral</div>
      <div className='row referral-id'>{referralId}</div>
      <div className='row referral-status'>({status})</div>
      {notification && <div className='row information-flag'>{notification}</div>}
    </td>
    <td>{county}</td>
    <td>
      <div className='row'>
        <div className='table-responsive'>
          <table className='table people-and-roles'>
            <colgroup>
              <col className='col-md-3' />
              <col className='col-md-3'/>
              <col className='col-md-6'/>
            </colgroup>
            <thead>
              <tr>
                <th scope='col' className='victim'>Victim</th>
                <th scope='col' className='perpetrator'>Perpetrator</th>
                <th scope='col' className='allegations disposition'>Allegation(s) &amp; Disposition</th>
              </tr>
            </thead>
            <tbody>
              {
                peopleAndRoles && peopleAndRoles.map(({victim, perpetrator, allegations, disposition}, index) => (
                  <tr key={index}>
                    <td className='victim'>{victim}</td>
                    <td className='perpetrator'>{perpetrator}</td>
                    <td className='allegations disposition'>{allegations} ({disposition})</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </td>
  </tr>
)

ReferralView.propTypes = {
  county: PropTypes.string,
  endDate: PropTypes.string,
  notification: PropTypes.string,
  peopleAndRoles: PropTypes.arrayOf(PropTypes.shape({
    allegations: PropTypes.string,
    disposition: PropTypes.string,
    perpetrator: PropTypes.string,
    victim: PropTypes.string,
  })),
  referralId: PropTypes.string,
  startDate: PropTypes.string,
  status: PropTypes.string,
}

export default ReferralView

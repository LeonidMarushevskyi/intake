import React from 'react'
import PropTypes from 'prop-types'

const ReferralView = ({dateRange, referralId, status, notification, county, peopleAndRoles, reporter, worker}) => (
  <tr>
    <td>{dateRange}</td>
    <td>
      <div className='referral'>Referral</div>
      <div className='referral-status'>({status})</div>
      <div className='referral-id'>{referralId}</div>
      {notification && <div className='information-flag'>{notification}</div>}
    </td>
    <td>{county}</td>
    <td>
      <table className='table people-and-roles'>
        <colgroup>
          <col className='col-md-3'/>
          <col className='col-md-3'/>
          <col className='col-md-6'/>
        </colgroup>
        <thead>
          <tr>
            <th scope='col' className='victim semibold'>Victim</th>
            <th scope='col' className='perpetrator semibold'>Perpetrator</th>
            <th scope='col' className='allegations disposition semibold'>Allegation(s) &amp; Disposition</th>
          </tr>
        </thead>
        <tbody>
          {
            peopleAndRoles.map(({victim, perpetrator, allegations, disposition}, index) => (
              <tr key={index}>
                <td className='victim'>{victim}</td>
                <td className='perpetrator'>{perpetrator}</td>
                <td className='allegations disposition'>{allegations} {disposition}</td>
              </tr>
            ))
          }
          <tr>
            <td colSpan='2'>
              <span className='semibold'>Reporter: </span>{reporter}
            </td>
            <td>
              <span className='semibold'>Worker: </span>{worker}
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
)

ReferralView.propTypes = {
  county: PropTypes.string,
  dateRange: PropTypes.string,
  notification: PropTypes.string,
  peopleAndRoles: PropTypes.arrayOf(PropTypes.shape({
    allegations: PropTypes.string,
    disposition: PropTypes.string,
    perpetrator: PropTypes.string,
    victim: PropTypes.string,
  })),
  referralId: PropTypes.string,
  reporter: PropTypes.string,
  status: PropTypes.string,
  worker: PropTypes.string,
}

export default ReferralView

import React from 'react'
import PropTypes from 'prop-types'
import CaseView from 'history/CaseView'
import ReferralView from 'history/ReferralView'
import ScreeningView from 'history/ScreeningView'

const HistoryTable = ({cases, referrals, screenings}) => (
  <div className='card-body no-pad-top'>
    <div className='table-responsive'>
      <table className='table table-hover'>
        <colgroup>
          <col className='col-md-2' />
          <col className='col-md-2'/>
          <col className='col-md-2' />
          <col className='col-md-6'/>
        </colgroup>
        <thead>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Type/Status</th>
            <th scope='col'>County/Office</th>
            <th scope='col'>People and Roles</th>
          </tr>
        </thead>
        <tbody>
          {screenings.map((screening, index) => <ScreeningView {...screening} key={index} />)}
          {referrals.map((referral, index) => <ReferralView {...referral} key={index} />)}
          {cases.map((hoiCase, index) => <CaseView {...hoiCase} key={index} />)}
        </tbody>
      </table>
    </div>
  </div>
)

HistoryTable.propTypes = {
  cases: PropTypes.array,
  referrals: PropTypes.array,
  screenings: PropTypes.array,
}

export default HistoryTable

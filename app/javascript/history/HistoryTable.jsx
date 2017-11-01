import React from 'react'
import PropTypes from 'prop-types'
import CaseContainer from 'investigations/CaseContainer'
import ReferralContainer from 'investigations/ReferralContainer'
import ScreeningContainer from 'investigations/ScreeningContainer'
import {nTimesDo} from 'utils/arrayHelper'

const HistoryTable = ({casesCount, referralsCount, screeningsCount}) => (
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
          {nTimesDo(screeningsCount, (index) => <ScreeningContainer index={index} key={index} />)}
          {nTimesDo(referralsCount, (index) => <ReferralContainer index={index} key={index} />)}
          {nTimesDo(casesCount, (index) => <CaseContainer index={index} key={index} />)}
        </tbody>
      </table>
    </div>
  </div>
)

HistoryTable.propTypes = {
  casesCount: PropTypes.number,
  referralsCount: PropTypes.number,
  screeningsCount: PropTypes.number,
}

export default HistoryTable

import React from 'react'
import PropTypes from 'prop-types'
import CaseContainer from 'history/CaseContainer'
import ReferralContainer from 'history/ReferralContainer'
import ScreeningContainer from 'history/ScreeningContainer'
import {nTimesDo} from 'utils/arrayHelper'

const HistoryTable = ({caseCount, referralCount, screeningCount}) => (
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
          {nTimesDo(screeningCount, (index) => <ScreeningContainer index={index} key={index} />)}
          {nTimesDo(referralCount, (index) => <ReferralContainer index={index} key={index} />)}
          {nTimesDo(caseCount, (index) => <CaseContainer index={index} key={index} />)}
        </tbody>
      </table>
    </div>
  </div>
)

HistoryTable.propTypes = {
  caseCount: PropTypes.number,
  referralCount: PropTypes.number,
  screeningCount: PropTypes.number,
}

export default HistoryTable

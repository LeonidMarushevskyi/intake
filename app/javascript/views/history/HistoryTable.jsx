import React from 'react'
import PropTypes from 'prop-types'
import CaseView from 'views/history/CaseView'
import ReferralView from 'views/history/ReferralView'
import ScreeningView from 'views/history/ScreeningView'
import Clipboard from 'react-clipboard.js'

export default class HistoryTable extends React.Component {
  render() {
    const {cases, onCopy, onError, onSuccess, referrals, screenings} = this.props
    return (<div className='card-body no-pad-top'>
      <div className='table-responsive' ref={(history) => { this.historyTable = history }}>
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
      <div className='row'>
        <div className='centered'>
          <Clipboard
            className='btn btn-primary'
            onSuccess={() => onSuccess(this.historyTable)}
            onError={() => onError(this.historyTable)}
            option-target={() => (onCopy(this.historyTable))}
          >
            Copy
          </Clipboard>
        </div>
      </div>
    </div>
    )
  }
}

HistoryTable.propTypes = {
  cases: PropTypes.array,
  onCopy: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  referrals: PropTypes.array,
  screenings: PropTypes.array,
}

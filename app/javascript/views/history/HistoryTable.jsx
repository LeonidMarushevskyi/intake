import React from 'react'
import PropTypes from 'prop-types'
import CaseView from 'views/history/CaseView'
import ReferralView from 'views/history/ReferralView'
import ScreeningView from 'views/history/ScreeningView'
import clipboard from 'clipboard-js'

export default class HistoryTable extends React.Component {
  render() {
    const {cases, referrals, screenings, showCopyButton} = this.props
    return (<div className='card-body no-pad-top'>
      <div className='table-responsive'>
        <table className='table table-hover' ref={(history) => { this.historyTable = history }}>
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
          { showCopyButton &&
            <button
              onClick={() => this.historyTable && clipboard.copy({
                'text/plain': this.historyTable.innerText,
                'text/html': this.historyTable.outerHTML,
              })}
              className='btn btn-primary'
            >
              Copy
            </button>
          }
          { !showCopyButton &&
              <p>To copy the history to your clipboard, highlight the table above, click the right button of your mouse, and select &quot;Copy.&quot;</p>
          }
        </div>
      </div>
    </div>
    )
  }
}

HistoryTable.propTypes = {
  cases: PropTypes.array,
  referrals: PropTypes.array,
  screenings: PropTypes.array,
  showCopyButton: PropTypes.bool,
}

import * as IntakeConfig from 'common/config'
import HistoryCardCase from 'screenings/HistoryCardCase'
import HistoryCardReferral from 'screenings/HistoryCardReferral'
import HistoryCardScreening from 'screenings/HistoryCardScreening'
import PropTypes from 'prop-types'
import React from 'react'
import clipboard from 'clipboard-js'
import {jsClipboardSupported} from 'common/config'

export default class HistoryCard extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {involvements} = this.props
    const screenings = involvements.get('screenings')
    const referrals = involvements.get('referrals')
    const cases = involvements.get('cases')
    const emptyInvolvements = involvements.every((involvement) => involvement.isEmpty())

    return (
      <div className='card show double-gap-top' id='history-card'>
        <div className='card-header'>
          <span>History</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row'>
            { emptyInvolvements &&
                <div className='col-md-12'>
                  <div className='double-gap-top  centered'>
                    <a href='#search-card'>Search for people</a>
                    <span className='c-dark-grey'> and add them to see their child welfare history.</span>
                  </div>
                </div>
            }
            {
              !emptyInvolvements &&
                <div className='table-responsive'>
                  <table className='table table-hover' ref={(history) => { this.historyTable = history }} >
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
                    <tbody id='history-of-involvement'>
                      {IntakeConfig.isFeatureInactive('release_two') && screenings && screenings.map((screening, screeningIndex) =>
                        <HistoryCardScreening screening={screening} index={screeningIndex} key={`screening-${screeningIndex}`} />
                      )}
                      {referrals && referrals.map((referral, referralIndex) =>
                        <HistoryCardReferral referral={referral} index={referralIndex} key={`referral-${referralIndex}`} />
                      )}
                      {cases && cases.map((hoiCase, caseIndex) =>
                        <HistoryCardCase hoiCase={hoiCase} index={caseIndex} key={`case-${caseIndex}`} />
                      )}
                    </tbody>
                  </table>
                </div>
            }
          </div>
          { !emptyInvolvements &&
            <div className='row'>
              <div className='centered'>
                { jsClipboardSupported() &&
                  <button
                    onClick={() =>
                      this.historyTable && clipboard.copy({
                        'text/plain': this.historyTable.innerText,
                        'text/html': this.historyTable.outerHTML,
                      })}
                    className='btn btn-primary'
                  >
                    Copy
                  </button>
                }
                { !jsClipboardSupported() &&
                  <p>To copy the history to your clipboard, highlight the table above, click the right button of your mouse, and select &quot;Copy.&quot;</p>
                }
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

HistoryCard.propTypes = {
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  screeningId: PropTypes.string.isRequired,
}

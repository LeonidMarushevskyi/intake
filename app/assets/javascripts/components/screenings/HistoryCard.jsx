import PropTypes from 'prop-types'
import React from 'react'
import HistoryCardScreening from 'components/screenings/HistoryCardScreening'
import HistoryCardReferral from 'components/screenings/HistoryCardReferral'
import HistoryCardCase from 'components/screenings/HistoryCardCase'

export default class HistoryCard extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillReceiveProps(nextProps) {
    const {participants, actions, screeningId} = this.props
    if (participants !== nextProps.participants) {
      actions.fetchHistoryOfInvolvements(screeningId)
    }
  }

  render() {
    const screenings = this.props.involvements.get('screenings')
    const referrals = this.props.involvements.get('referrals')
    const cases = this.props.involvements.get('cases')

    return (
      <div className='card show double-gap-top' id='history-card'>
        <div className='card-header'>
          <span>History</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row'>
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
                <tbody id='history-of-involvement'>
                  {screenings && screenings.map((screening, screeningIndex) =>
                    <HistoryCardScreening screening={screening} index={screeningIndex} />
                  )}
                  {referrals && referrals.map((referral, referralIndex) =>
                    <HistoryCardReferral referral={referral} index={referralIndex} />
                  )}
                  {cases && cases.map((hoiCase, caseIndex) =>
                    <HistoryCardCase hoiCase={hoiCase} index={caseIndex} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
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

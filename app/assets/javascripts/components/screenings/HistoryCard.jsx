import PropTypes from 'prop-types'
import React from 'react'
import HistoryCardScreening from 'components/screenings/HistoryCardScreening'
import HistoryCardReferral from 'components/screenings/HistoryCardReferral'
import HistoryCardCase from 'components/screenings/HistoryCardCase'

export default class HistoryCard extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const {actions, participants, screeningId} = this.props
    if (!participants.isEmpty()) {
      actions.fetchHistoryOfInvolvements(screeningId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {participants, actions, screeningId} = this.props
    if (participants !== nextProps.participants) {
      actions.fetchHistoryOfInvolvements(screeningId)
    }
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
              'Add a person in order to see History of Involvement'
            }
            {
              !emptyInvolvements &&
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

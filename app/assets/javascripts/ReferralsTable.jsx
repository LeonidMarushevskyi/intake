import React from 'react'
import ResponseTime from 'ResponseTime'
import ScreeningDecision from 'ScreeningDecision'
import moment from 'moment'

export default class ReferralsTable extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='double-padded border-regular-light-gray'>
        <div className='table-responsive'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th scope='col'>Name &amp; ID</th>
                <th scope='col'>Response Time</th>
                <th scope='col'>Decision</th>
                <th scope='col'>Report Date</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.referrals.map((referralObject) => {
                  const referral = referralObject.attributes
                  return (
                    <tr key={referral.id}>
                      <td><a href={`/referrals/${referral.id}`}>{`${referral.name} - ${referral.reference}`}</a></td>
                      <td>{ResponseTime[referral.response_time]}</td>
                      <td>{ScreeningDecision[referral.screening_decision]}</td>
                      <td>{moment(referral.created_at).format('MM/DD/YYYY')}</td>
                    </tr>
                    )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

ReferralsTable.propTypes = {
  referrals: React.PropTypes.array,
}

ReferralsTable.defaultProps = {
  referrals: [],
}

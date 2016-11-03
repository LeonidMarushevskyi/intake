import React from 'react'
import RESPONSE_TIME from 'ResponseTime'
import SCREENING_DECISION from 'ScreeningDecision'
import moment from 'moment'

export default class ScreeningsTable extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
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
              this.props.screenings.map((screening) => (
                  <tr key={screening.id}>
                    <td><a href={`/screenings/${screening.id}`}>{`${screening.name} - ${screening.reference}`}</a></td>
                    <td>{RESPONSE_TIME[screening.response_time]}</td>
                    <td>{SCREENING_DECISION[screening.screening_decision]}</td>
                    <td>{moment(screening.created_at).format('MM/DD/YYYY')}</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

ScreeningsTable.propTypes = {
  screenings: React.PropTypes.array,
}

ScreeningsTable.defaultProps = {
  screenings: [],
}

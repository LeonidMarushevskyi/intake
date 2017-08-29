import PropTypes from 'prop-types'
import React from 'react'
import ScreeningRow from 'screenings/ScreeningRow'

const ScreeningsTable = ({screenings}) => (
  <div className='table-responsive'>
    <table className='table table-hover'>
      <thead>
        <tr>
          <th className='col-md-3' scope='col'>Screening Name</th>
          <th scope='col'>Type/Decision</th>
          <th scope='col'>Status</th>
          <th scope='col'>Assignee</th>
          <th scope='col'>Report Date and Time</th>
        </tr>
      </thead>
      <tbody>
        {
          screenings.map(({id, name, screening_decision, screening_decision_detail, assignee, started_at}) => (
            <ScreeningRow
              key={id}
              id={id}
              name={name}
              decision={screening_decision}
              decisionDetail={screening_decision_detail}
              assignee={assignee}
              startedAt={started_at}
            />
          )
          )
        }
      </tbody>
    </table>
  </div>
)

ScreeningsTable.propTypes = {
  screenings: PropTypes.array,
}

ScreeningsTable.defaultProps = {
  screenings: [],
}
export default ScreeningsTable

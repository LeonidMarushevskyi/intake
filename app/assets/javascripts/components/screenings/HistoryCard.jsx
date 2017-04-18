import moment from 'moment'
import React from 'react'

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
    return (
      <div className='card show double-gap-top' id='history-card'>
        <div className='card-header'>
          <span>History</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row'>
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Type/Status</th>
                    <th scope='col'>County/Office</th>
                    <th scope='col'>People and Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.involvements.map((involvement, index) => {
                      const startedAt = involvement.get('started_at')
                      return (<tr key={index}>
                        <td>{ moment(startedAt).format('MM/DD/YYYY') }</td>
                      </tr>)
                    })
                  }
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
  actions: React.PropTypes.object.isRequired,
  involvements: React.PropTypes.object.isRequired,
  participants: React.PropTypes.object.isRequired,
  screeningId: React.PropTypes.string.isRequired,
}

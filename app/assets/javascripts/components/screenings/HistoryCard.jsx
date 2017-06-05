import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import nameFormatter from 'utils/nameFormatter'
import HistoryCardScreening from 'components/screenings/HistoryCardScreening'

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

  renderReferrals() {
    return this.props.involvements.get('referrals').map((referral, index) => {
      const startedAt = referral.get('start_date')
      const endedAt = referral.get('end_date')
      const status = endedAt ? 'Closed' : 'In Progress'
      const incidentCounty = referral.get('county_name')
      const reporter = referral.get('reporter')
      const assignee = referral.get('assigned_social_worker')
      const allegations = referral.get('allegations')

      return (
        <tr key={`referral-${index}`}>
          <td>{ moment(startedAt).format('MM/DD/YYYY') }</td>
          <td>
            <div className='row'>Referral</div>
            <div className='row'>{`(${status})`}</div>
          </td>
          <td>{incidentCounty}</td>
          <td>
            <div className='row'>
              <div className='table-responsive'>
                <table className='table'>
                  <colgroup>
                    <col className='col-md-3' />
                    <col className='col-md-3'/>
                    <col className='col-md-6'/>
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope='col'>Victim</th>
                      <th scope='col'>Perpetrator</th>
                      <th scope='col'>Allegation(s) &amp; Disposition</th>
                    </tr>
                  </thead>
                  <tbody>
                    { allegations && allegations.map((allegation) => {
                      const disposition = allegation.get('disposition_description') || 'Pending decision'
                      return (
                        <tr>
                          <td>{allegation ? nameFormatter(allegation, {name_type: 'victim', name_default: ''}) : ''}</td>
                          <td>{allegation ? nameFormatter(allegation, {name_type: 'perpetrator', name_default: ''}) : ''}</td>
                          <td>{`${allegation.get('allegation_description')} (${disposition})`}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='row'>
              <span className='col-md-6 reporter'>
                {`Reporter: ${reporter ? nameFormatter(reporter, {name_default: ''}) : ''}`}
              </span>
              <span className='col-md-6 assignee'>
                {`Worker: ${assignee ? nameFormatter(assignee, {name_default: ''}) : ''}`}
              </span>
            </div>
          </td>
        </tr>
      )
    })
  }

  renderHOI() {
    const hoi = []
    if (this.props.involvements.get('referrals')) {
      hoi.push(this.renderReferrals())
    }
    return hoi
  }

  render() {
    const screenings = this.props.involvements.get('screenings')
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
                  { screenings && screenings.map((screening, screeningIndex) =>
                    <HistoryCardScreening screening={screening} index={screeningIndex} />
                  )}
                  {
                    this.renderHOI()
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
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  screeningId: PropTypes.string.isRequired,
}

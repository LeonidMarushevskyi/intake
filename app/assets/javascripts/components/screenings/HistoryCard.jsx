import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import nameFormatter from 'utils/nameFormatter'
import {ROLE_TYPE_NON_REPORTER} from 'RoleType'

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
                  {
                    this.props.involvements.map((involvement, index) => {
                      const startedAt = involvement.get('start_date')
                      const endedAt = involvement.get('end_date')
                      const incidentCounty = involvement.get('county_name')
                      const participants = involvement.get('all_people')
                      const reporter = involvement.get('reporter')
                      const assignee = involvement.get('assigned_social_worker')
                      const nonReporterTypes = Immutable.fromJS(ROLE_TYPE_NON_REPORTER)

                      let nonOnlyReporters

                      if (participants) {
                        nonOnlyReporters = participants.filter((p) => {
                          const roles = p.get('roles')
                          return roles.some((role) => nonReporterTypes.includes(role)) || roles.isEmpty()
                        })
                      } else {
                        nonOnlyReporters = Immutable.List()
                      }

                      const status = endedAt ? 'Closed' : 'In Progress'
                      return (
                        <tr key={index}>
                          <td>{ moment(startedAt).format('MM/DD/YYYY') }</td>
                          <td>
                            <div className='row'>Screening</div>
                            <div className='row'>{`(${status})`}</div>
                          </td>
                          <td>{incidentCounty}</td>
                          <td>
                            <div className='row'>
                              <span className='col-md-12 participants'>
                                { nonOnlyReporters.map((p) => nameFormatter(p)).join(', ') }
                              </span>
                            </div>
                            <div className='row'>
                              <span className='col-md-6 reporter'>
                                {`Reporter: ${reporter ? nameFormatter(reporter) : '' }`}
                              </span>
                              <span className='col-md-6 assignee'>
                                {`Worker: ${assignee ? nameFormatter(assignee) : ''}`}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
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
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  screeningId: PropTypes.string.isRequired,
}

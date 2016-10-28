import * as Utils from 'utils/http'
import Immutable from 'immutable'
import React from 'react'
import ParticipantShowView from 'ParticipantShowView'
import CommunicationMethod from 'CommunicationMethod'
import moment from 'moment'

export default class ScreeningShowPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      screening: Immutable.fromJS({
        name: '',
        started_at: '',
        ended_at: '',
        communication_method: '',
        participants: [],
        report_narrative: '',
      }),
    }
    this.fetch = this.fetch.bind(this)
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    const {params} = this.props
    const xhr = Utils.request('GET', `/screenings/${params.id}.json`)
    xhr.done((xhrResp) => {
      this.setState({screening: Immutable.fromJS(xhrResp.responseJSON)})
    })
  }

  renderParticipantsCard() {
    const {screening} = this.state
    return (
      <div>
        {
          screening.get('participants').map((participant) =>
            <ParticipantShowView key={participant.get('id')} participant={participant} />
          )
        }
      </div>
    )
  }

  parseDateTime(dateTime) {
    return (dateTime === null ? '' : moment.utc(dateTime).format('MM/DD/YYYY hh:mm A'))
  }

  renderScreeningInformationCard() {
    const {screening} = this.state

    return (
      <div className='card double-gap-top' id='screening-information-card'>
        <div className='card-header'>
          <span>Screening Information</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap'>Title/Name of Screening</label>
              <div className='c-gray'>{screening.get('name')}</div>
            </div>
          </div>
          <div className='row double-gap-top'>
            <div className='col-md-6'>
              <label className='no-gap'>Screening Start Date/Time</label>
              <div className='c-gray'>{this.parseDateTime(screening.get('started_at'))}</div>
            </div>
            <div className='col-md-6'>
              <label className='no-gap'>Screening End Date/Time</label>
              <div className='c-gray'>{this.parseDateTime(screening.get('ended_at'))}</div>
            </div>
          </div>
          <div className='row double-gap-top'>
            <div className='col-md-6'>
              <label className='no-gap'>Communication Method</label>
              <div className='c-gray'>{CommunicationMethod[screening.get('communication_method')]}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderNarrativeCard() {
    const {screening} = this.state
    return (
      <div className='card double-gap-top' id='narrative-card'>
        <div className='card-header'>
          <span>Narrative</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap'>Report Narrative</label>
              <div className='c-gray'>{screening.get('report_narrative')}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderScreeningInformationCard()}
        {this.renderParticipantsCard()}
        {this.renderNarrativeCard()}
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

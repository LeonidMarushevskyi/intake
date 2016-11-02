import * as Utils from 'utils/http'
import Immutable from 'immutable'
import InformationShowView from 'components/screenings/InformationShowView'
import React from 'react'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import ReferralInformationShowView from 'components/screenings/ReferralInformationShowView'

export default class ScreeningShowPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      screening: Immutable.fromJS({
        reference: '',
        name: '',
        started_at: '',
        ended_at: '',
        communication_method: '',
        participants: [],
        report_narrative: '',
        incident_date: '',
        incident_county: '',
        address: Immutable.fromJS({
          street_address: '',
          city: '',
          state: '',
          zip: '',
        }),
        location_type: '',
        response_time: '',
        screening_decision: '',
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
            <ParticipantCardView key={participant.get('id')} participant={participant} mode='show'/>
          )
        }
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
    const {screening} = this.state
    return (
      <div>
        <h1>{`Screening #${screening.get('reference')}`}</h1>
        <InformationShowView screening={screening}/>
        {this.renderParticipantsCard()}
        {this.renderNarrativeCard()}
        <ReferralInformationShowView screening={screening}/>
        <a href={'/'} className='gap-right'>Home</a>
        <a href={`/screenings/${screening.get('id')}/edit`}>Edit</a>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

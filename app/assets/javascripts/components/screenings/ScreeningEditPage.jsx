import * as Utils from 'utils/http'
import {browserHistory} from 'react-router'
import Immutable from 'immutable'
import React from 'react'
import Autocompleter from 'Autocompleter'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import InformationEditView from 'components/screenings/InformationEditView'
import NarrativeEditView from 'components/screenings/NarrativeEditView'
import ReferralInformationEditView from 'components/screenings/ReferralInformationEditView'

export default class ScreeningEditPage extends React.Component {
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
          id: '',
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
    this.setField = this.setField.bind(this)
    this.addParticipant = this.addParticipant.bind(this)
    this.update = this.update.bind(this)
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

  show() {
    const {params} = this.props
    browserHistory.push({
      pathname: `/screenings/${params.id}`,
    })
  }

  update() {
    const {params} = this.props
    const url = `/screenings/${params.id}.json`
    const xhr = Utils.request('PUT', url, {screening: this.state.screening.toJS()}, null)
    xhr.done((xhrResp) => {
      this.setState({screening: Immutable.fromJS(xhrResp.responseJSON)})
      this.show()
    })
  }

  setField(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    this.setState({screening: screening})
  }

  addParticipant(participant) {
    const {screening} = this.state
    const participants = screening.get('participants').push(Immutable.Map(participant))
    this.setState({
      screening: screening.set('participants', participants),
    })
  }

  renderParticipantsCard() {
    const {screening} = this.state
    return (
      <div>
        <div className='card edit double-gap-top' id='participants-card'>
          <div className='card-header'>
            <span>Participants</span>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6'>
                <label className='no-gap' htmlFor='screening_participants'>Participants</label>
                <Autocompleter id='screening_participants' onSelect={this.addParticipant}/>
              </div>
            </div>
          </div>
        </div>
        {
          screening.get('participants').map((participant) =>
            <ParticipantCardView key={participant.get('id')} participant={participant} mode='edit'/>
          )
        }
      </div>
    )
  }

  render() {
    const {screening} = this.state
    return (
      <div>
        <h1>{`Edit Screening #${screening.get('reference')}`}</h1>
        <input type='hidden' id='id' value={screening.get('id') || ''} />
        <input type='hidden' id='created_at' value={screening.get('created_at') || ''} />
        <input type='hidden' id='updated_at' value={screening.get('updated_at') || ''} />
        <input type='hidden' id='reference' value={screening.get('reference') || ''} />
        <InformationEditView screening={screening} onChange={this.setField} />
        {this.renderParticipantsCard()}
        <NarrativeEditView screening={screening} onChange={this.setField} />
        <ReferralInformationEditView screening={screening} onChange={this.setField} />
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={this.update}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

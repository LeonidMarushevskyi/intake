import * as Utils from 'utils/http'
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
    return (
      <div>
        <InformationEditView screening={this.state.screening} onChange={this.setField} />
        {this.renderParticipantsCard()}
        <NarrativeEditView screening={this.state.screening} onChange={this.setField} />
        <ReferralInformationEditView screening={this.state.screening} onChange={this.setField} />
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

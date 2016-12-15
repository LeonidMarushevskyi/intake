import {browserHistory} from 'react-router'
import * as screeningActions from 'actions/screeningActions'
import * as participantActions from 'actions/participantActions'
import Immutable from 'immutable'
import React from 'react'
import Autocompleter from 'components/common/Autocompleter'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import InformationEditView from 'components/screenings/InformationEditView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
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
      loaded: false,
    }

    const methods = [
      'fetch',
      'setField',
      'addParticipant',
      'update',
      'createParticipant',
      'cardSave',
      'saveAll',
    ]
    methods.forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    const {params} = this.props
    screeningActions.fetch(params.id)
      .then((jsonResponse) => {
        this.setState({
          screening: Immutable.fromJS(jsonResponse),
          loaded: true,
        })
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
    screeningActions.save(params.id, this.state.screening.toJS())
      .then((jsonResponse) => {
        this.setState({screening: Immutable.fromJS(jsonResponse)})
        this.show()
      })
  }

  setField(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    this.setState({screening: screening})
  }

  cardSave(fieldSeq, value) {
    const {params} = this.props
    const screening = this.state.screening.setIn(fieldSeq, value)
    return screeningActions.save(params.id, screening.toJS())
      .then((jsonResponse) => {
        this.setState({screening: Immutable.fromJS(jsonResponse)})
      })
  }

  addParticipant(participant) {
    const {screening} = this.state
    const participants = screening.get('participants').push(Immutable.Map(participant))
    this.setState({
      screening: screening.merge({participants: participants}),
    })
  }

  createParticipant(person) {
    const {params} = this.props
    const participant = Object.assign({}, person, {screening_id: params.id, person_id: person.id, id: null})
    participantActions.create(params.id, participant)
      .then((jsonResponse) => {
        this.addParticipant(jsonResponse)
      })
  }

  saveAll() {
    if (this.state.loaded) {
      const narrativeCardSave = this.refs.narrativeCard.onSave()
      narrativeCardSave.then(() => this.update())
    }
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
                <Autocompleter id='screening_participants' onSelect={this.createParticipant}/>
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
    const {screening, loaded} = this.state
    return (
      <div>
        <h1>{`Edit Screening #${screening.get('reference')}`}</h1>
        <InformationEditView screening={screening} onChange={this.setField} />
        {this.renderParticipantsCard()}
        {
          loaded &&
            <NarrativeCardView
              ref='narrativeCard'
              narrative={screening.get('report_narrative') || ''}
              mode='edit'
              onSave={(value) => this.cardSave(['report_narrative'], value)}
            />
        }
        <ReferralInformationEditView screening={screening} onChange={this.setField} />
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={this.saveAll}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

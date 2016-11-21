import * as screeningActions from 'actions/screening'
import Immutable from 'immutable'
import InformationShowView from 'components/screenings/InformationShowView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import React from 'react'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import ReferralInformationShowView from 'components/screenings/ReferralInformationShowView'
import {IndexLink, Link} from 'react-router'

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
      loaded: false,
    }
    this.fetch = this.fetch.bind(this)
    this.cardSave = this.cardSave.bind(this)
    this.setField = this.setField.bind(this)
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

  cardSave(fieldSeq, value) {
    const {params} = this.props
    const screening = this.state.screening.setIn(fieldSeq, value)
    return screeningActions.save(params.id, screening.toJS())
      .then((jsonResponse) => {
        this.setState({screening: Immutable.fromJS(jsonResponse)})
      })
  }

  setField(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    this.setState({screening: screening})
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

  render() {
    const {params} = this.props
    const {screening, loaded} = this.state
    return (
      <div>
        <h1>{`Screening #${screening.get('reference')}`}</h1>
        <InformationShowView screening={screening}/>
        {this.renderParticipantsCard()}
        {loaded && <NarrativeCardView
          narrative={screening.get('report_narrative')}
          mode='show'
          onSave={(value) => this.cardSave(['report_narrative'], value)}
        />}
        <ReferralInformationShowView screening={screening}/>
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${params.id}/edit`}>Edit</Link>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

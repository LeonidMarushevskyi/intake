import * as screeningActions from 'actions/screeningActions'
import HistoryCard from 'components/screenings/HistoryCard'
import InformationShowView from 'components/screenings/InformationShowView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import IncidentInformationShowView from 'components/screenings/IncidentInformationShowView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningShowPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {loaded: false}
    this.cardSave = this.cardSave.bind(this)
    this.deleteParticipant = this.deleteParticipant.bind(this)
  }

  componentDidMount() {
    this.props.actions.fetchScreening(this.props.params.id)
      .then(() => this.setState({loaded: true}))
  }

  cardSave(fieldSeq, value) {
    const screening = this.props.screening.setIn(fieldSeq, value)
    return this.props.actions.saveScreening(screening.toJS())
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
  }

  renderParticipantsCard() {
    const {participants} = this.props

    return (
      <div>
        {
          participants.map((participant) =>
            <ParticipantCardView key={participant.get('id')} participant={participant} onDelete={this.deleteParticipant} mode='show'/>
          )
        }
      </div>
    )
  }

  render() {
    const {params, screening} = this.props
    const {loaded} = this.state
    return (
      <div>
        <h1>{`Screening #${screening.get('reference')}`}</h1>
        <InformationShowView screening={screening}/>
        {this.renderParticipantsCard()}
        {
          loaded &&
            <NarrativeCardView
              narrative={screening.get('report_narrative')}
              mode='show'
              onSave={(value) => this.cardSave(['report_narrative'], value)}
            />
        }
        <IncidentInformationShowView screening={screening}/>
        <HistoryCard />
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${params.id}/edit`}>Edit</Link>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  actions: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  participants: React.PropTypes.object.isRequired,
  screening: React.PropTypes.object.isRequired,
}

function mapStateToProps(state, _ownProps) {
  return {
    participants: state.participants,
    screening: state.screening,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningShowPage)

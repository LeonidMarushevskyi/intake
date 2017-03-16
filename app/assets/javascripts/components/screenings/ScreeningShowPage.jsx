import * as screeningActions from 'actions/screeningActions'
import AllegationsShowView from 'components/screenings/AllegationsShowView'
import CrossReportShowView from 'components/screenings/CrossReportShowView'
import DecisionCardView from 'components/screenings/DecisionCardView'
import HistoryCard from 'components/screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import WorkerSafetyShowView from 'components/screenings/WorkerSafetyShowView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningShowPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.List(),
    }
    this.cancelEdit = this.cancelEdit.bind(this)
    this.cardSave = this.cardSave.bind(this)
    this.deleteParticipant = this.deleteParticipant.bind(this)
    this.setField = this.setField.bind(this)
    this.saveParticipant = this.saveParticipant.bind(this)
    this.setParticipantField = this.setParticipantField.bind(this)
    this.cancelParticipantEdit = this.cancelParticipantEdit.bind(this)
  }

  componentDidMount() {
    this.props.actions.fetchScreening(this.props.params.id)
      .then(() => this.setState({loaded: true}))
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.screening.equals(nextProps.screening)) {
      this.setState({screening: nextProps.screening})
    }
  }

  setField(fieldSeq, value) {
    const screeningEdits = this.state.screeningEdits.setIn(fieldSeq, value)
    this.setState({screeningEdits: screeningEdits})
  }

  cardSave(fieldList) {
    const changes = this.state.screeningEdits.filter((value, key) =>
      fieldList.includes(key) && value !== undefined
    )
    const screening = this.state.screening.mergeDeep(changes)
    return this.props.actions.saveScreening(screening.toJS())
  }

  cancelEdit(fieldList) {
    const updatedEdits = this.state.screeningEdits.filterNot((value, key) => fieldList.includes(key))
    this.setState({screeningEdits: updatedEdits})
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
  }

  setParticipantField(index, value) {
    const participantsEdits = this.state.participantsEdits.setIn([index], value)
    this.setState({participantsEdits: participantsEdits})
  }

  cancelParticipantEdit(index) {
    const updatedParticipantsEdits = this.state.participantsEdits.setIn([index], Immutable.Map())
    this.setState({participantsEdits: updatedParticipantsEdits})
  }

  saveParticipant(index) {
    const participantChanges = this.state.participantsEdits.get(index)
    const participant = this.props.participants.get(index).mergeDeep(participantChanges)
    return this.props.actions.saveParticipant(participant.toJS())
  }

  participants() {
    const participantsProps = this.props.participants
    // Make sure our edits list never contains undefined items, which will stomp on present items in mergeDeep
    const participantsEdits = this.state.participantsEdits.map((edits) => (edits || Immutable.Map()))
    return participantsProps.mergeDeep(participantsEdits)
  }

  renderParticipantsCard() {
    const participants = this.participants()

    return (
      <div>
        {
          participants.map((participant, index) =>
            <ParticipantCardView
              index={index}
              key={participant.get('id')}
              onCancel={this.cancelParticipantEdit}
              onDelete={this.deleteParticipant}
              onChange={this.setParticipantField}
              onSave={this.saveParticipant}
              participant={participant}
              mode='show'
            />
          )
        }
      </div>
    )
  }

  render() {
    const {params} = this.props
    const {loaded, screening} = this.state
    const mergedScreening = screening.mergeDeep(this.state.screeningEdits)
    return (
      <div>
        <h1>{`Screening #${mergedScreening.get('reference')}`}</h1>
        { loaded &&
          <ScreeningInformationCardView
            mode='show'
            screening={mergedScreening}
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
          />
        }
        {this.renderParticipantsCard()}
        {
          loaded &&
            <NarrativeCardView
              mode='show'
              narrative={mergedScreening.get('report_narrative')}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
            />
        }
        {
          loaded &&
            <IncidentInformationCardView
              mode='show'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              screening={mergedScreening}
            />
        }
        <CrossReportShowView />
        {
          loaded &&
          <DecisionCardView
            mode='show'
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            screening={mergedScreening}
          />
        }
        <AllegationsShowView />
        <WorkerSafetyShowView />
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

import * as screeningActions from 'actions/screeningActions'
import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Autocompleter from 'components/common/Autocompleter'
import CrossReportEditView from 'components/screenings/CrossReportEditView'
import DecisionCardView from 'components/screenings/DecisionCardView'
import HistoryCard from 'components/screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

export class ScreeningEditPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.List(),
      autocompleterFocus: false,
    }

    const methods = [
      'cancelEdit',
      'cardSave',
      'cancelParticipantEdit',
      'createParticipant',
      'deleteParticipant',
      'setField',
      'setParticipantField',
      'saveParticipant',
      'update',
    ]
    methods.forEach((method) => {
      this[method] = this[method].bind(this)
    })
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

  show() {
    const {params} = this.props
    browserHistory.push({pathname: `/screenings/${params.id}`})
  }

  update() {
    const {screening} = this.state
    this.props.actions.saveScreening(screening.toJS()).then(() => this.show())
  }

  setField(fieldSeq, value) {
    const screeningEdits = this.state.screeningEdits.setIn(fieldSeq, value)
    this.setState({screeningEdits: screeningEdits})
  }

  setParticipantField(index, value) {
    const participantsEdits = this.state.participantsEdits.setIn([index], value)
    this.setState({participantsEdits: participantsEdits})
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

  cancelParticipantEdit(index) {
    const updatedParticipantsEdits = this.state.participantsEdits.setIn([index], Immutable.Map())
    this.setState({participantsEdits: updatedParticipantsEdits})
  }

  createParticipant(person) {
    const {params} = this.props
    const participant = Object.assign({}, person, {screening_id: params.id, person_id: person.id, id: null})
    this.props.actions.createParticipant(participant)
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
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
        <div className='card edit double-gap-top' id='search-card'>
          <div className='card-header'>
            <span>Search</span>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-12'>
                <label className='no-gap pull-left' htmlFor='screening_participants'>Search for any person</label>
                <span className='c-gray pull-left half-gap-left'>(Children, parents, collaterals, reporters, alleged perpetrators...)</span>
                <Autocompleter id='screening_participants'
                  onSelect={this.createParticipant}
                  enableFooter={true}
                />
              </div>
            </div>
          </div>
        </div>
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
              mode='edit'
            />
            )

        }
      </div>
    )
  }

  render() {
    const {screening, loaded} = this.state
    const mergedScreening = screening.mergeDeep(this.state.screeningEdits)
    return (
      <div>
        <h1>{`Edit Screening #${mergedScreening.get('reference')}`}</h1>
        {
          loaded &&
          <ScreeningInformationCardView
            mode='edit'
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            screening={mergedScreening}
          />
        }
        {this.renderParticipantsCard()}
        {
          loaded &&
          <NarrativeCardView
            mode='edit'
            narrative={mergedScreening.get('report_narrative')}
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            ref='narrativeCard'
          />
        }
        {
          loaded &&
          <IncidentInformationCardView
            mode='edit'
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            ref='incidentInformationCard'
            screening={mergedScreening}
          />
        }
        <CrossReportEditView />
        {
          loaded &&
          <DecisionCardView
            mode='edit'
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            ref='decisionInformationCard'
            screening={mergedScreening}
          />
        }
        <AllegationsCardView />
        <WorkerSafetyCardView />
        <HistoryCard />
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary'>Submit</button>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningEditPage)

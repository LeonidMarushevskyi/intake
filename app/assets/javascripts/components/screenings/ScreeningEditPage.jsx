import * as screeningActions from 'actions/screeningActions'
import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Autocompleter from 'components/common/Autocompleter'
import CrossReportCardView from 'components/screenings/CrossReportCardView'
import DecisionCardView from 'components/screenings/DecisionCardView'
import HistoryCard from 'components/screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import {sortedAllegationsList} from 'utils/allegationsHelper'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningEditPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.Map(),
      autocompleterFocus: false,
    }

    const methods = [
      'cancelEdit',
      'cancelParticipantEdit',
      'cardSave',
      'createParticipant',
      'deleteParticipant',
      'mergeScreeningWithEdits',
      'participants',
      'saveParticipant',
      'setField',
      'setParticipantField',
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

  setField(fieldSeq, value, callback) {
    const screeningEdits = this.state.screeningEdits.setIn(fieldSeq, value)
    this.setState({screeningEdits: screeningEdits}, callback)
  }

  setParticipantField(id, value) {
    const participantsEdits = this.state.participantsEdits.set(id, value)
    this.setState({participantsEdits: participantsEdits})
  }

  cardSave(fieldList) {
    let screening
    if (fieldList.includes('allegations')) {
      const allegations = sortedAllegationsList(
        this.props.screening.get('id'),
        this.props.participants,
        this.props.screening.get('allegations'),
        this.state.screeningEdits.get('allegations')
      ).filterNot((allegation) => allegation.get('allegation_types').isEmpty())

      screening = this.state.screening.set('allegations', allegations)
    } else {
      const changes = this.state.screeningEdits.filter((value, key) =>
        fieldList.includes(key) && value !== undefined
      )
      screening = this.mergeScreeningWithEdits(changes)
    }
    return this.props.actions.saveScreening(screening.toJS())
  }

  cancelEdit(fieldList) {
    const updatedEdits = this.state.screeningEdits.filterNot((value, key) => fieldList.includes(key))
    this.setState({screeningEdits: updatedEdits})
  }

  cancelParticipantEdit(id) {
    const updatedParticipantsEdits = this.state.participantsEdits.delete(id)
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

  saveParticipant(participant) {
    return this.props.actions.saveParticipant(participant.toJS())
      .then(() => {
        this.props.actions.fetchScreening(this.props.params.id)
      })
  }

  mergeScreeningWithEdits(changes) {
    // Changes in lists are already applied and returned in `changes`.
    // No need to merge old list with new list.
    const lists = changes.filter((val) => val !== null && val.constructor.name === 'List')
    const nonlists = changes.filterNot((val) => val !== null && val.constructor.name === 'List')
    let screening = this.state.screening
    lists.map((v, k) => {
      screening = screening.set(k, v)
    })
    return screening.mergeDeep(nonlists)
  }

  participants() {
    // We want to merge the keys of each participant, but we don't want deep merge
    // to combine the address lists for us. So, we do a custom merge at one level deep.
    const mergedParticipants = this.props.participants.map((participant) => {
      const participantId = participant.get('id')
      const relevantEdits = this.state.participantsEdits.get(participantId)
      const participantEdits = (relevantEdits || Immutable.Map())
      return participant.merge(participantEdits)
    })

    return mergedParticipants
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
                <label className='pull-left' htmlFor='screening_participants'>Search for any person</label>
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
          participants.map((participant) =>
            <ParticipantCardView
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
    const mergedScreening = this.mergeScreeningWithEdits(this.state.screeningEdits)
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
        {
          loaded &&
            <AllegationsCardView
              allegations={sortedAllegationsList(
                screening.get('id'),
                this.props.participants,
                screening.get('allegations'),
                this.state.screeningEdits.get('allegations')
              )}
              mode='edit'
              onCancel={this.cancelEdit}
              onSave={this.cardSave}
              setField={this.setField}
            />
        }
        {
          loaded &&
            <WorkerSafetyCardView
              screening={mergedScreening}
              mode='edit'
              onCancel={this.cancelEdit}
              onSave={this.cardSave}
              onChange={this.setField}
            />
        }
        <HistoryCard
          screeningId={this.props.params.id}
          actions={this.props.actions}
          involvements={this.props.involvements}
          participants={this.props.participants}
        />
        {
          loaded &&
            <CrossReportCardView
              crossReport={mergedScreening.get('cross_reports')}
              mode='edit'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              ref='crossReportCard'
            />
        }
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
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' data-toggle='modal' data-target='#submitModal'>Submit</button>
          </div>
        </div>
        <div aria-label='submit modal confirmation' className='modal fade' id='submitModal'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-body'>
                <p>
                  Congratulations! You have completed the process to submit a screening.
                </p>
                <p>
                  This is just a learning environment. If your Decision was to promote to referral,
                  this does NOT create an actual referral and it will not appear in CWS/CMS.
                </p>
              </div>
              <div className='modal-footer'>
                <div className='row'>
                  <div className='centered'>
                    <a href='/' >
                      <button className='btn btn-primary' href='/' type='button'>Proceed</button>
                    </a>
                    <button aria-label='Close' className='btn btn-default' data-dismiss='modal' type='button'>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

export function mapStateToProps(state, _ownProps) {
  return {
    involvements: state.involvements,
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

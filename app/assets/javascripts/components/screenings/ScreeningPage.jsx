import * as IntakeConfig from 'config'
import * as screeningActions from 'actions/screeningActions'
import AllegationsCardView from 'components/screenings/AllegationsCardView'
import Autocompleter from 'components/common/Autocompleter'
import CreateUnknownParticipant from 'components/screenings/CreateUnknownParticipant'
import CrossReportCardView from 'components/screenings/CrossReportCardView'
import DecisionCardView from 'components/screenings/DecisionCardView'
import HistoryCard from 'components/screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import PropTypes from 'prop-types'
import React from 'react'
import RelationshipsCard from 'components/screenings/RelationshipsCard'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import ScreeningSubmitButton from 'components/screenings/ScreeningSubmitButton'
import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import {IndexLink, Link} from 'react-router'
import {areCrossReportsRequired, sortedAllegationsList, removeInvalidAllegations} from 'utils/allegationsHelper'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.Map(),
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
    this.mode = this.props.params.mode || this.props.mode
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
    const participant = Object.assign({}, person, {screening_id: params.id, legacy_id: person.id, id: null})
    this.props.actions.createParticipant(participant)
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
  }

  saveParticipant(participant) {
    return this.props.actions.saveParticipant(participant.toJS())
      .then(() => {
        this.props.actions.fetchScreening(this.props.params.id)
        this.setField(['allegations'], removeInvalidAllegations(participant, this.state.screeningEdits.get('allegations')))
      })
  }

  mergeScreeningWithEdits(changes) {
    // Changes in lists are already applied and returned in `changes`.
    // No need to merge old list with new list.
    const lists = changes.filter((val) => Immutable.List.isList(val))
    const nonlists = changes.filterNot((val) => Immutable.List.isList(val))
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

  renderAutocompleter() {
    return (
      <div className='card edit double-gap-top' id='search-card'>
        <div className='card-header'>
          <span>Search</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-12'>
              <label className='pull-left' htmlFor='screening_participants'>Search for any person(Children, parents, collaterals, reporters, alleged perpetrators...)</label>
              <Autocompleter id='screening_participants'
                onSelect={this.createParticipant}
                footer={
                  IntakeConfig.isFeatureInactive('release_two') &&
                  <CreateUnknownParticipant saveCallback={this.createParticipant}/>
                  }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderParticipantsCard() {
    const participants = this.participants()

    return (
      <div>
        { this.mode === 'edit' && this.renderAutocompleter() }
        {
          participants.map((participant) =>
            <ParticipantCardView
              key={participant.get('id')}
              onCancel={this.cancelParticipantEdit}
              onDelete={this.deleteParticipant}
              onChange={this.setParticipantField}
              onSave={this.saveParticipant}
              participant={participant}
              mode={IntakeConfig.isFeatureInactive('release_two') ? this.mode : 'show'}
            />
            )
        }
      </div>
    )
  }

  renderFooterLinks() {
    return (
      <div>
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${this.props.params.id}/edit`}>Edit</Link>
      </div>
    )
  }

  render() {
    const {screening, loaded} = this.state
    const mergedScreening = this.mergeScreeningWithEdits(this.state.screeningEdits)
    const releaseTwoInactive = IntakeConfig.isFeatureInactive('release_two')
    const releaseTwo = IntakeConfig.isFeatureActive('release_two')
    let sortedAllegations
    if (releaseTwoInactive) {
      sortedAllegations = sortedAllegationsList(
        screening.get('id'),
        this.props.participants,
        screening.get('allegations'),
        this.state.screeningEdits.get('allegations')
      )
    }
    if (loaded) {
      return (
        <div>
          {
            releaseTwoInactive &&
              <h1>{this.mode === 'edit' && 'Edit '}{`Screening #${mergedScreening.get('reference')}`}</h1>
          }
          {
            releaseTwo &&
              <div className='card edit double-gap-top' id='snapshot-card'>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='double-pad-top'>
                        The Child Welfare History Snapshot allows you to search CWS/CMS for people and their past history with CWS.
                        To start, search by any combination of name, date of birth, or social security number. Click on a person from
                        the results to add them to the Snapshot, and their basic information and history will automatically appear below.
                        You can add as many people as you like, and when ready, copy the summary of their history.
                        You will need to manually paste it into a document or a field in CWS/CMS.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          }
          {
            releaseTwoInactive &&
            <ScreeningInformationCardView
              mode={this.mode}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              screening={mergedScreening}
            />
          }
          {this.renderParticipantsCard()}
          {
            releaseTwoInactive &&
            <NarrativeCardView
              mode={this.mode}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              narrative={mergedScreening.get('report_narrative')}
            />
          }
          {
            releaseTwoInactive &&
            <IncidentInformationCardView
              mode={this.mode}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              screening={mergedScreening}
            />
          }
          {
            releaseTwoInactive &&
              <AllegationsCardView
                mode={this.mode}
                onCancel={this.cancelEdit}
                onSave={this.cardSave}
                setField={this.setField}
                allegations={sortedAllegations}
              />
          }
          {
            releaseTwoInactive &&
            <RelationshipsCard
              actions={this.props.actions}
              participants={this.props.participants}
              relationships={this.props.relationships}
              screeningId={this.props.params.id}
            />
          }
          {
            releaseTwoInactive &&
              <WorkerSafetyCardView
                mode={this.mode}
                onCancel={this.cancelEdit}
                onSave={this.cardSave}
                onChange={this.setField}
                screening={mergedScreening}
              />
          }
          <HistoryCard
            screeningId={this.props.params.id}
            actions={this.props.actions}
            involvements={this.props.involvements}
            participants={this.props.participants}
          />
          {
            releaseTwoInactive &&
              <CrossReportCardView
                mode={this.mode}
                onCancel={this.cancelEdit}
                onSave={this.cardSave}
                onChange={this.setField}
                areCrossReportsRequired={areCrossReportsRequired(sortedAllegations)}
                crossReports={mergedScreening.get('cross_reports')}
              />
          }
          {
            releaseTwoInactive &&
            <DecisionCardView
              mode={this.mode}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              screening={mergedScreening}
            />
          }
          {
            releaseTwoInactive &&
            <ScreeningSubmitButton actions={this.props.actions} params={this.props.params} />
          }
          { this.mode === 'show' && this.renderFooterLinks() }
        </div>
      )
    } else {
      return (<div />)
    }
  }
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  relationships: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

ScreeningPage.defaultProps = {
  mode: 'show',
}

export function mapStateToProps(state, _ownProps) {
  return {
    involvements: state.involvements,
    participants: state.participants,
    relationships: state.relationships,
    screening: state.screening,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningPage)


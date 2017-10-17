import * as AllegationsHelper from 'utils/allegationsHelper'
import * as IntakeConfig from 'common/config'
import * as screeningActions from 'actions/screeningActions'
import {checkStaffPermission} from 'actions/staffActions'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import AllegationsCardView from 'screenings/AllegationsCardView'
import Autocompleter from 'common/Autocompleter'
import CreateUnknownParticipant from 'screenings/CreateUnknownParticipant'
import CrossReportCardView from 'screenings/CrossReportCardView'
import DecisionCardView from 'screenings/DecisionCardView'
import HistoryCard from 'screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'screenings/IncidentInformationCardView'
import NarrativeCardView from 'screenings/NarrativeCardView'
import ParticipantCardView from 'screenings/ParticipantCardView'
import PropTypes from 'prop-types'
import React from 'react'
import RelationshipsCard from 'screenings/RelationshipsCard'
import ScreeningInformationCardView from 'screenings/ScreeningInformationCardView'
import ScreeningSubmitButton from 'screenings/ScreeningSubmitButton'
import ScreeningSubmitButtonWithModal from 'screenings/ScreeningSubmitButtonWithModal'
import ScreeningValidator from 'screenings/ScreeningValidator'
import WorkerSafetyCardView from 'screenings/WorkerSafetyCardView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import {
  getAgencyCodeToName,
  getDistrictAttorneyAgencies,
  getDepartmentOfJusticeAgencies,
  getLawEnforcementAgencies,
  getCountyLicensingAgencies,
  getCommunityCareLicensingAgencies,
} from 'selectors/countyAgenciesSelectors'

export class ScreeningPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.Map(),
    }

    const methods = [
      'cancelEdit',
      'cancelParticipantEdit',
      'cardSave',
      'createParticipant',
      'canCreateParticipant',
      'deleteParticipant',
      'mergeScreeningWithEdits',
      'participants',
      'renderMode',
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
    this.props.actions.checkStaffPermission('add_sensitive_people')
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.screening.equals(nextProps.screening)) {
      this.setState({screening: nextProps.screening})
    }
  }

  renderMode() {
    if (!this.props.editable) {
      return 'show'
    }
    return this.props.mode
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
      const allegations = AllegationsHelper.sortedAllegationsList(
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

  canCreateParticipant(person) {
    return (person.sensitive === false || this.props.hasAddSensitivePerson)
  }

  createParticipant(person) {
    const {params} = this.props
    const participant = Object.assign({}, person, {
      screening_id: params.id,
      legacy_id: person.id,
      id: null,
    })
    this.props.actions.createParticipant(participant)
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
  }

  saveParticipant(participant) {
    this.props.actions.saveParticipant(participant.toJS())
    this.setField(
      ['allegations'],
      AllegationsHelper.removeInvalidAllegations(participant, this.state.screeningEdits.get('allegations'))
    )
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
                isSelectable={this.canCreateParticipant}
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
        { this.renderMode() === 'edit' && this.renderAutocompleter() }
        {
          participants.map((participant) =>
            <ParticipantCardView
              editable={this.props.editable}
              key={participant.get('id')}
              onCancel={this.cancelParticipantEdit}
              onDelete={this.deleteParticipant}
              onChange={this.setParticipantField}
              onSave={this.saveParticipant}
              participant={participant}
              mode={IntakeConfig.isFeatureInactive('release_two') ? this.renderMode() : 'show'}
            />
          )
        }
      </div>
    )
  }

  renderFooterLinks() {
    return (
      <div>
        <IndexLink to={'/'} className='gap-right'>Home</IndexLink>
        {this.props.editable && <Link to={`/screenings/${this.props.params.id}/edit`}>Edit</Link>}
      </div>
    )
  }

  render() {
    const cardCallbacks = {
      onCancel: this.cancelEdit,
      onChange: this.setField,
      onSave: this.cardSave,
    }
    const {screening} = this.state
    const mergedScreening = this.mergeScreeningWithEdits(this.state.screeningEdits)
    const editable = this.props.editable
    const mode = this.renderMode()
    const releaseTwoInactive = IntakeConfig.isFeatureInactive('release_two')
    const releaseTwo = IntakeConfig.isFeatureActive('release_two')

    let sortedAllegations
    let cardErrors
    if (releaseTwoInactive) {
      sortedAllegations = AllegationsHelper.sortedAllegationsList(
        screening.get('id'),
        this.props.participants,
        screening.get('allegations'),
        this.state.screeningEdits.get('allegations')
      )
      const screeningValidator = new ScreeningValidator({
        screening: mergedScreening,
        allegations: sortedAllegations,
      })
      cardErrors = screeningValidator.validateScreening()
    }

    if (this.props.loaded) {
      return (
        <div>
          {
            releaseTwoInactive &&
              <h1>
                {mode === 'edit' && 'Edit '}
                {`Screening #${mergedScreening.get('reference')}`}
                {mergedScreening.get('referral_id') && ` - Referral #${mergedScreening.get('referral_id')}`}
              </h1>
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
              {...cardCallbacks}
              editable={editable}
              mode={mode}
              screening={mergedScreening}
            />
          }
          {this.renderParticipantsCard()}
          {releaseTwoInactive && <NarrativeCardView editable={editable} mode={mode} />}
          {
            releaseTwoInactive &&
            <IncidentInformationCardView
              {...cardCallbacks}
              editable={editable}
              errors={cardErrors.get('incident_information_card') || Immutable.List()}
              mode={mode}
              screening={mergedScreening}
            />
          }
          {
            releaseTwoInactive &&
              <AllegationsCardView
                allegations={sortedAllegations}
                required={AllegationsHelper.areAllegationsRequired(mergedScreening.toJS())}
                {...cardCallbacks}
                editable={editable}
                mode={mode}
              />
          }
          {
            releaseTwoInactive &&
            <RelationshipsCard
              actions={this.props.actions}
              editable={editable}
              participants={this.props.participants}
              relationships={this.props.relationships}
              screeningId={this.props.params.id}
            />
          }
          {
            releaseTwoInactive &&
              <WorkerSafetyCardView
                {...cardCallbacks}
                editable={editable}
                mode={mode}
                screening={mergedScreening}
              />
          }
          <HistoryCard
            actions={this.props.actions}
            editable={editable}
            involvements={this.props.involvements}
            participants={this.props.participants}
            screeningId={this.props.params.id}
          />
          {
            releaseTwoInactive &&
              <CrossReportCardView
                agencyCodeToName={this.props.agencyCodeToName}
                areCrossReportsRequired={AllegationsHelper.areCrossReportsRequired(sortedAllegations)}
                {...cardCallbacks}
                counties={this.props.counties}
                countyAgencies={this.props.countyAgencies}
                crossReports={mergedScreening.get('cross_reports')}
                editable={editable}
                actions={this.props.actions}
                mode={mode}
              />
          }
          {
            releaseTwoInactive &&
            <DecisionCardView
              {...cardCallbacks}
              editable={editable}
              errors={cardErrors.get('decision_card')}
              mode={mode}
              screening={mergedScreening}
            />
          }
          {
            releaseTwoInactive &&
            IntakeConfig.isFeatureActive('referral_submit') &&
            editable &&
            <ScreeningSubmitButton actions={this.props.actions} params={this.props.params} />
          }
          {
            releaseTwoInactive &&
            editable &&
            IntakeConfig.isFeatureInactive('referral_submit') &&
            <ScreeningSubmitButtonWithModal />
          }
          {
            releaseTwo &&
            <div className='row double-gap-top'>
              <div className='centered'>
                <a href={IntakeConfig.basePath()} >
                  <button className='btn btn-primary' href={IntakeConfig.basePath()} type='button'>Start Over</button>
                </a>
              </div>
            </div>
          }
          { mode === 'show' && this.renderFooterLinks() }
        </div>
      )
    } else {
      return (<div />)
    }
  }
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  agencyCodeToName: PropTypes.object,
  counties: PropTypes.array,
  countyAgencies: PropTypes.object,
  editable: PropTypes.bool,
  hasAddSensitivePerson: PropTypes.bool,
  involvements: PropTypes.object.isRequired,
  loaded: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  relationships: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

ScreeningPage.defaultProps = {
  agencyCodeToName: {},
  counties: [],
  countyAgencies: {},
  mode: 'show',
  hasAddSensitivePerson: false,
}

export function mapStateToProps(state, ownProps) {
  return {
    agencyCodeToName: getAgencyCodeToName(state),
    editable: !state.getIn(['screening', 'referral_id']),
    counties: state.get('counties').toJS(),
    countyAgencies: {
      stuff: state.get('countyAgencies').toJS(),
      [DEPARTMENT_OF_JUSTICE]: getDepartmentOfJusticeAgencies(state).toJS(),
      [DISTRICT_ATTORNEY]: getDistrictAttorneyAgencies(state).toJS(),
      [LAW_ENFORCEMENT]: getLawEnforcementAgencies(state).toJS(),
      [COMMUNITY_CARE_LICENSING]: getCommunityCareLicensingAgencies(state).toJS(),
      [COUNTY_LICENSING]: getCountyLicensingAgencies(state).toJS(),
    },
    hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
    involvements: state.get('involvements'),
    loaded: state.getIn(['screening', 'fetch_status']) === 'FETCHED',
    participants: state.get('participants'),
    relationships: state.get('relationships'),
    screening: state.get('screening'),
    mode: ownProps.params.mode,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = Object.assign({}, screeningActions, {checkStaffPermission}, {fetchCountyAgencies})
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningPage)

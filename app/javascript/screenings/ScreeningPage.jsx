import * as IntakeConfig from 'common/config'
import * as screeningActions from 'actions/screeningActions'
import * as personCardActions from 'actions/personCardActions'
import {checkStaffPermission} from 'actions/staffActions'
import AllegationsCardView from 'screenings/AllegationsCardView'
import Autocompleter from 'common/Autocompleter'
import CreateUnknownParticipant from 'screenings/CreateUnknownParticipant'
import CrossReportCardView from 'screenings/crossReports/CrossReportCardView'
import DecisionCardView from 'screenings/DecisionCardView'
import IncidentInformationCardView from 'screenings/IncidentInformationCardView'
import NarrativeCardView from 'screenings/NarrativeCardView'
import ParticipantCardView from 'screenings/ParticipantCardView'
import PropTypes from 'prop-types'
import React from 'react'
import RelationshipsCardContainer from 'screenings/RelationshipsCardContainer'
import ScreeningInformationCardView from 'screenings/ScreeningInformationCardView'
import ScreeningSubmitButton from 'screenings/ScreeningSubmitButton'
import ScreeningSubmitButtonWithModal from 'screenings/ScreeningSubmitButtonWithModal'
import WorkerSafetyCardView from 'screenings/WorkerSafetyCardView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import HistoryOfInvolvementContainer from 'containers/screenings/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/screenings/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'

export class ScreeningPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {screening: props.screening}

    const methods = [
      'createParticipant',
      'canCreateParticipant',
      'renderMode',
    ]
    methods.forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount() {
    this.props.actions.fetchScreening(this.props.params.id)
    this.props.actions.fetchRelationships(this.props.params.id)
    this.props.actions.fetchHistoryOfInvolvements(this.props.params.id)
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
    this.props.actions.createPerson(participant)
  }

  render() {
    const {screening, editable} = this.props
    const mode = this.renderMode()
    const releaseTwoInactive = IntakeConfig.isFeatureInactive('release_two')
    const releaseTwo = IntakeConfig.isFeatureActive('release_two')

    if (this.props.loaded) {
      return (
        <div>
          {
            releaseTwoInactive &&
              <h1>
                {mode === 'edit' && 'Edit '}
                {`Screening #${screening.get('reference')}`}
                {screening.get('referral_id') && ` - Referral #${screening.get('referral_id')}`}
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
          {releaseTwoInactive && <ScreeningInformationCardView editable={editable} mode={mode} />}
          {this.renderMode() === 'edit' &&
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
          }
          {this.props.participants.map((participant) =>
            <ParticipantCardView
              key={participant.get('id')}
              participant={participant}
              mode={IntakeConfig.isFeatureInactive('release_two') ? this.renderMode() : 'show'}
            />
          )}
          {releaseTwoInactive && <NarrativeCardView editable={editable} mode={mode} />}
          {releaseTwoInactive && <IncidentInformationCardView editable={editable} mode={mode}/>}
          {releaseTwoInactive && <AllegationsCardView mode={mode} />}
          {releaseTwoInactive && <RelationshipsCardContainer />}
          {releaseTwoInactive && <WorkerSafetyCardView editable={editable} mode={mode} />}
          <HistoryOfInvolvementContainer empty={<EmptyHistory />} notEmpty={<HistoryTableContainer />} />
          {releaseTwoInactive && <CrossReportCardView editable={editable} mode={mode} />}
          {releaseTwoInactive && <DecisionCardView mode={mode}/>}
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
          { mode === 'show' &&
            <div>
              <IndexLink to={'/'} className='gap-right'>Home</IndexLink>
              {this.props.editable && <Link to={`/screenings/${this.props.params.id}/edit`}>Edit</Link>}
            </div>
          }
        </div>
      )
    } else {
      return (<div />)
    }
  }
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  hasAddSensitivePerson: PropTypes.bool,
  loaded: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  relationships: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

ScreeningPage.defaultProps = {
  mode: 'show',
  hasAddSensitivePerson: false,
}

export function mapStateToProps(state, ownProps) {
  return {
    editable: !state.getIn(['screening', 'referral_id']),
    hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
    loaded: state.getIn(['screening', 'fetch_status']) === 'FETCHED',
    participants: state.get('participants'),
    relationships: state.get('relationships'),
    screening: state.get('screening'),
    mode: ownProps.params.mode,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = Object.assign({}, personCardActions, screeningActions, {checkStaffPermission})
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningPage)

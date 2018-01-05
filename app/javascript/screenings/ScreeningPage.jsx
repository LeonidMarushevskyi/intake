import * as IntakeConfig from 'common/config'
import * as screeningActions from 'actions/screeningActions'
import * as personCardActions from 'actions/personCardActions'
import {setPageMode} from 'actions/screeningPageActions'
import {checkStaffPermission} from 'actions/staffActions'
import PersonCardView from 'screenings/PersonCardView'
import PropTypes from 'prop-types'
import React from 'react'
import RelationshipsCardContainer from 'screenings/RelationshipsCardContainer'
import CardContainer from 'containers/screenings/CardContainer'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import HistoryOfInvolvementContainer from 'containers/screenings/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/screenings/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import PersonSearchFormContainer from 'containers/screenings/PersonSearchFormContainer'
import ErrorDetail from 'common/ErrorDetail'
import ScreeningInformationFormContainer from 'containers/screenings/ScreeningInformationFormContainer'
import ScreeningInformationShowContainer from 'containers/screenings/ScreeningInformationShowContainer'
import ScreeningSideBar from 'screenings/ScreeningSideBar'
import NarrativeFormContainer from 'containers/screenings/NarrativeFormContainer'
import NarrativeShowContainer from 'containers/screenings/NarrativeShowContainer'
import IncidentInformationFormContainer from 'containers/screenings/IncidentInformationFormContainer'
import AllegationsFormContainer from 'containers/screenings/AllegationsFormContainer'
import AllegationsShowContainer from 'containers/screenings/AllegationsShowContainer'
import IncidentInformationShowContainer from 'containers/screenings/IncidentInformationShowContainer'
import WorkerSafetyFormContainer from 'containers/screenings/WorkerSafetyFormContainer'
import WorkerSafetyShowContainer from 'containers/screenings/WorkerSafetyShowContainer'
import CrossReportFormContainer from 'containers/screenings/CrossReportFormContainer'
import CrossReportShowContainer from 'containers/screenings/CrossReportShowContainer'
import DecisionFormContainer from 'containers/screenings/DecisionFormContainer'
import DecisionShowContainer from 'containers/screenings/DecisionShowContainer'
import {getScreeningSubmissionErrorsSelector, getApiValidationErrorsSelector} from 'selectors/errorsSelectors'

export class ScreeningPage extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const {
      actions: {
        setPageMode,
        fetchScreening,
        fetchRelationships,
        fetchHistoryOfInvolvements,
        checkStaffPermission,
      },
      params: {mode, id},
    } = this.props
    setPageMode(mode || 'show')
    fetchScreening(id)
    fetchRelationships(id)
    fetchHistoryOfInvolvements(id)
    checkStaffPermission('add_sensitive_people')
  }

  renderScreeningPage() {
    const {referralId, editable, mode, loaded, hasApiValidationErrors, submitReferralErrors} = this.props
    const releaseTwoInactive = IntakeConfig.isFeatureInactive('release_two')
    const releaseTwo = IntakeConfig.isFeatureActive('release_two')

    if (loaded) {
      return (
        <div>
          {
            releaseTwoInactive &&
              <h1>{referralId && `Referral #${referralId}`}</h1>
          }
          {
            releaseTwo &&
              <div className='card edit double-gap-bottom' id='snapshot-card'>
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
          {releaseTwoInactive && hasApiValidationErrors && <ErrorDetail errors={submitReferralErrors} />}
          {releaseTwoInactive &&
            <CardContainer
              title='Screening Information'
              id='screening-information-card'
              edit={<ScreeningInformationFormContainer />}
              show={<ScreeningInformationShowContainer />}
            />
          }
          {editable && <PersonSearchFormContainer />}
          {this.props.participants.map((participant) =>
            <PersonCardView key={participant.get('id')} personId={participant.get('id')} />
          )}
          {releaseTwoInactive &&
            <CardContainer
              title='Narrative'
              id='narrative-card'
              edit={<NarrativeFormContainer />}
              show={<NarrativeShowContainer />}
            />
          }
          {releaseTwoInactive &&
            <CardContainer
              title='Incident Information'
              id='incident-information-card'
              edit={<IncidentInformationFormContainer />}
              show={<IncidentInformationShowContainer />}
            />
          }
          {releaseTwoInactive &&
            <CardContainer
              title='Allegations'
              id='allegations-card'
              edit={<AllegationsFormContainer />}
              show={<AllegationsShowContainer />}
            />
          }
          {releaseTwoInactive && <RelationshipsCardContainer />}
          {releaseTwoInactive &&
            <CardContainer
              title='Worker Safety'
              id='worker-safety-card'
              edit={<WorkerSafetyFormContainer />}
              show={<WorkerSafetyShowContainer />}
            />
          }
          <HistoryOfInvolvementContainer empty={<EmptyHistory />} notEmpty={<HistoryTableContainer />} />
          {releaseTwoInactive &&
            <CardContainer
              title='Cross Report'
              id='cross-report-card'
              edit={<CrossReportFormContainer />}
              show={<CrossReportShowContainer />}
            />
          }
          {releaseTwoInactive &&
            <CardContainer
              title='Decision'
              id='decision-card'
              edit={<DecisionFormContainer />}
              show={<DecisionShowContainer />}
            />
          }
          {
            releaseTwo &&
            <div className='row double-gap-top'>
              <div className='centered'>
                <Link to='/' className='btn btn-primary'>Start Over</Link>
              </div>
            </div>
          }
          { releaseTwoInactive && mode === 'show' &&
            <div>
              <Link to='/' className='gap-right'>Home</Link>
              {editable && <Link to={`/screenings/${this.props.params.id}/edit`}>Edit</Link>}
            </div>
          }
        </div>
      )
    } else {
      return (<div />)
    }
  }

  render() {
    if (IntakeConfig.isFeatureActive('release_two')) {
      return this.renderScreeningPage()
    } else {
      return (
        <div className='row'>
          <ScreeningSideBar />
          <div className='col-md-10'>{this.renderScreeningPage()}</div>
        </div>
      )
    }
  }
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  disableSubmitButton: PropTypes.bool,
  editable: PropTypes.bool,
  hasAddSensitivePerson: PropTypes.bool,
  hasApiValidationErrors: PropTypes.bool,
  loaded: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  reference: PropTypes.string,
  referralId: PropTypes.string,
  submitReferralErrors: PropTypes.array,
}

ScreeningPage.defaultProps = {
  mode: 'show',
  hasAddSensitivePerson: false,
}

export function mapStateToProps(state, _ownProps) {
  return {
    editable: !state.getIn(['screening', 'referral_id']),
    hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
    loaded: state.getIn(['screening', 'fetch_status']) === 'FETCHED',
    mode: state.getIn(['screeningPage', 'mode']),
    participants: state.get('participants'),
    reference: state.getIn(['screening', 'reference']),
    referralId: state.getIn(['screening', 'referral_id']),
    hasApiValidationErrors: Boolean(getApiValidationErrorsSelector(state).size),
    submitReferralErrors: getScreeningSubmissionErrorsSelector(state).toJS(),
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = Object.assign({}, personCardActions, screeningActions, {checkStaffPermission, setPageMode})
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningPage)

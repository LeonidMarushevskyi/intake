import * as IntakeConfig from 'common/config'
import * as screeningActions from 'actions/screeningActions'
import * as personCardActions from 'actions/personCardActions'
import {setPageMode} from 'actions/screeningPageActions'
import {checkStaffPermission} from 'actions/staffActions'
import AllegationsCardView from 'screenings/AllegationsCardView'
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
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import HistoryOfInvolvementContainer from 'containers/screenings/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/screenings/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import PersonSearchFormContainer from 'containers/screenings/PersonSearchFormContainer'
import ErrorDetail from 'common/ErrorDetail'
import {getScreeningSubmissionErrorsSelector, getTotalScreeningSubmissionErrorValueSelector} from 'selectors/errorsSelectors'

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
      editable,
      params: {mode, id},
    } = this.props

    if (editable) {
      setPageMode(mode || 'show')
    } else {
      setPageMode('show')
    }
    fetchScreening(id)
    fetchRelationships(id)
    fetchHistoryOfInvolvements(id)
    checkStaffPermission('add_sensitive_people')
  }

  render() {
    const {referralId, reference, editable, mode, loaded, hasErrors, submitReferralErrors} = this.props
    const releaseTwoInactive = IntakeConfig.isFeatureInactive('release_two')
    const releaseTwo = IntakeConfig.isFeatureActive('release_two')

    if (loaded) {
      return (
        <div>
          {
            releaseTwoInactive &&
              <h1>
                {mode === 'edit' && 'Edit '}
                {`Screening #${reference}`}
                {referralId && ` - Referral #${referralId}`}
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
          {releaseTwoInactive && hasErrors && <ErrorDetail errors={submitReferralErrors} />}
          {releaseTwoInactive && <ScreeningInformationCardView editable={editable} mode={mode} />}
          <PersonSearchFormContainer />
          {this.props.participants.map((participant) =>
            <ParticipantCardView
              key={participant.get('id')}
              participant={participant}
              mode={IntakeConfig.isFeatureInactive('release_two') ? mode : 'show'}
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
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  hasAddSensitivePerson: PropTypes.bool,
  hasErrors: PropTypes.bool,
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
    hasErrors: Boolean(getTotalScreeningSubmissionErrorValueSelector(state)),
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

import * as screeningActions from 'actions/screeningActions'
import * as personCardActions from 'actions/personCardActions'
import {setPageMode} from 'actions/screeningPageActions'
import {
  fetchHistoryOfInvolvements,
  clearHistoryOfInvolvement,
} from 'actions/historyOfInvolvementActions'
import {
  fetchRelationships,
  clearRelationships,
} from 'actions/relationshipsActions'
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
import PageHeader from 'common/PageHeader'
import {getScreeningSubmissionErrorsSelector, getApiValidationErrorsSelector} from 'selectors/errorsSelectors'
import {getScreeningTitleSelector, getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {
  getAllCardsAreSavedValueSelector,
  getScreeningHasErrorsSelector,
  getPeopleHaveErrorsSelector,
} from 'selectors/screening/screeningPageSelectors'

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
      },
      params: {mode, id},
    } = this.props
    setPageMode(mode || 'show')
    fetchScreening(id)
    fetchRelationships('screenings', id)
    fetchHistoryOfInvolvements('screenings', id)
  }

  componentWillUnmount() {
    const {
      actions: {
        clearHistoryOfInvolvement,
        clearRelationships,
        clearPeople,
        clearScreening,
      },
    } = this.props
    clearHistoryOfInvolvement()
    clearRelationships()
    clearPeople()
    clearScreening()
  }

  submitButton() {
    const {editable, disableSubmitButton, params: {id}, actions: {submitScreening}} = this.props
    if (editable) {
      return (
        <button type='button'
          className='btn primary-btn pull-right'
          disabled={disableSubmitButton}
          onClick={() => submitScreening(id)}
        >
          Submit
        </button>
      )
    } else {
      return (<div />)
    }
  }

  renderScreening() {
    const {referralId, editable, mode, loaded, hasApiValidationErrors, submitReferralErrors} = this.props

    if (loaded) {
      return (
        <div className='row'>
          <ScreeningSideBar />
          <div className='col-md-10'>
            <h1>{referralId && `Referral #${referralId}`}</h1>
            {hasApiValidationErrors && <ErrorDetail errors={submitReferralErrors} />}
            <CardContainer
              title='Screening Information'
              id='screening-information-card'
              edit={<ScreeningInformationFormContainer />}
              show={<ScreeningInformationShowContainer />}
            />
            {editable && <PersonSearchFormContainer />}
            {this.props.participants.map(({id}) =>
              <PersonCardView key={id} personId={id} />
            )}
            <CardContainer
              title='Narrative'
              id='narrative-card'
              edit={<NarrativeFormContainer />}
              show={<NarrativeShowContainer />}
            />
            <CardContainer
              title='Incident Information'
              id='incident-information-card'
              edit={<IncidentInformationFormContainer />}
              show={<IncidentInformationShowContainer />}
            />
            <CardContainer
              title='Allegations'
              id='allegations-card'
              edit={<AllegationsFormContainer />}
              show={<AllegationsShowContainer />}
            />
            <RelationshipsCardContainer />
            <CardContainer
              title='Worker Safety'
              id='worker-safety-card'
              edit={<WorkerSafetyFormContainer />}
              show={<WorkerSafetyShowContainer />}
            />
            <HistoryOfInvolvementContainer empty={<EmptyHistory />} notEmpty={<HistoryTableContainer />} />
            <CardContainer
              title='Cross Report'
              id='cross-report-card'
              edit={<CrossReportFormContainer />}
              show={<CrossReportShowContainer />}
            />
            <CardContainer
              title='Decision'
              id='decision-card'
              edit={<DecisionFormContainer />}
              show={<DecisionShowContainer />}
            />
            { mode === 'show' &&
              <div>
                <Link to='/' className='gap-right'>Home</Link>
                {editable && <Link to={`/screenings/${this.props.params.id}/edit`}>Edit</Link>}
              </div>
            }
          </div>
        </div>
      )
    } else {
      return (<div />)
    }
  }

  render() {
    return (
      <div>
        <div>
          <PageHeader pageTitle={this.props.screeningTitle} button={this.submitButton()} />
        </div>
        <div className='container'>
          {this.renderScreening()}
        </div>
      </div>
    )
  }
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  disableSubmitButton: PropTypes.bool,
  editable: PropTypes.bool,
  hasApiValidationErrors: PropTypes.bool,
  loaded: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  reference: PropTypes.string,
  referralId: PropTypes.string,
  screeningTitle: PropTypes.string,
  submitReferralErrors: PropTypes.array,
}

ScreeningPage.defaultProps = {
  mode: 'show',
}

export function mapStateToProps(state, _ownProps) {
  return {
    disableSubmitButton: !getAllCardsAreSavedValueSelector(state) ||
      getScreeningHasErrorsSelector(state) ||
      getPeopleHaveErrorsSelector(state),
    editable: !getScreeningIsReadOnlySelector(state),
    loaded: state.getIn(['screening', 'fetch_status']) === 'FETCHED',
    mode: state.getIn(['screeningPage', 'mode']),
    participants: state.get('participants').toJS(),
    reference: state.getIn(['screening', 'reference']),
    referralId: state.getIn(['screening', 'referral_id']),
    hasApiValidationErrors: Boolean(getApiValidationErrorsSelector(state).size),
    screeningTitle: getScreeningTitleSelector(state),
    submitReferralErrors: getScreeningSubmissionErrorsSelector(state).toJS(),
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = {
    setPageMode,
    fetchHistoryOfInvolvements,
    clearHistoryOfInvolvement,
    fetchRelationships,
    clearRelationships,
    ...personCardActions,
    ...screeningActions,
  }
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningPage)

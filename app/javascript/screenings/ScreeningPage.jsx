import * as screeningActions from 'actions/screeningActions'
import * as personCardActions from 'actions/personCardActions'
import {setPageMode} from 'actions/screeningPageActions'
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
      },
      params: {mode, id},
    } = this.props
    setPageMode(mode || 'show')
    fetchScreening(id)
    fetchRelationships(id)
    fetchHistoryOfInvolvements(id)
  }

  render() {
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
            {this.props.participants.map((participant) =>
              <PersonCardView key={participant.get('id')} personId={participant.get('id')} />
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
}

ScreeningPage.propTypes = {
  actions: PropTypes.object.isRequired,
  editable: PropTypes.bool,
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
}

export function mapStateToProps(state, _ownProps) {
  return {
    editable: !state.getIn(['screening', 'referral_id']),
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
  const actions = {...personCardActions, ...screeningActions, setPageMode}
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningPage)

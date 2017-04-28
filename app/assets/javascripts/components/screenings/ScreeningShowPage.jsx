import * as screeningActions from 'actions/screeningActions'
import * as screeningEditHelpers from 'utils/screeningEditHelper'
import AllegationsCardView from 'components/screenings/AllegationsCardView'
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
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {mapStateToProps} from 'components/screenings/ScreeningEditPage'
import {addNewAllegations} from 'utils/allegationsHelper'

export class ScreeningShowPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.Map(),
    }
    const sharedMethods = [
      'cancelEdit',
      'cancelParticipantEdit',
      'cardSave',
      'deleteParticipant',
      'mergeScreeningWithEdits',
      'participants',
      'saveParticipant',
      'setField',
      'setParticipantField',
    ]
    sharedMethods.forEach((method) => {
      this[method] = screeningEditHelpers[method].bind(this)
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

  renderParticipantsCard() {
    const participants = this.participants()

    return (
      <div>
        {
          participants.map((participant) =>
            <ParticipantCardView
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
    const mergedScreening = this.mergeScreeningWithEdits(this.state.screeningEdits)
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
        {
          loaded &&
            <AllegationsCardView
              mode='show'
              allegations={addNewAllegations(
                screening.get('id'),
                this.props.participants,
                screening.get('allegations'),
                this.state.screeningEdits.get('allegations')
              )}
              onCancel={this.cancelEdit}
              onSave={this.cardSave}
              setField={this.setField}
            />
        }
        {
          loaded &&
          <WorkerSafetyCardView
            mode='show'
            screening={mergedScreening}
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
          />
        }
        <HistoryCard
          actions={this.props.actions}
          involvements={this.props.involvements}
          participants={this.props.participants}
          screeningId={params.id}
        />
        {
          loaded &&
            <CrossReportCardView
              crossReport={mergedScreening.get('cross_reports')}
              mode='show'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
            />
        }
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
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${params.id}/edit`}>Edit</Link>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningShowPage)

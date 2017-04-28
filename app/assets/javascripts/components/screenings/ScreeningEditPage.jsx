import * as screeningActions from 'actions/screeningActions'
import * as screeningEditHelpers from 'utils/screeningEditHelper'
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
import {addNewAllegations} from 'utils/allegationsHelper'
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

    const sharedMethods = [
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
              allegations={addNewAllegations(
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

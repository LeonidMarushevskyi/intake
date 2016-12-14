import {browserHistory} from 'react-router'
import * as screeningActions from 'actions/screeningActions'
import * as participantActions from 'actions/participantActions'
import Immutable from 'immutable'
import React from 'react'
import Autocompleter from 'components/common/Autocompleter'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import InformationEditView from 'components/screenings/InformationEditView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ReferralInformationEditView from 'components/screenings/ReferralInformationEditView'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningEditPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      screening: props.screening,
      loaded: false,
    }

    const methods = [
      'setField',
      'addParticipant',
      'update',
      'createParticipant',
      'cardSave',
      'saveAll',
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
    this.setState({screening: nextProps.screening})
  }

  show() {
    const {params} = this.props
    browserHistory.push({pathname: `/screenings/${params.id}`})
  }

  update() {
    const {params} = this.props
    screeningActions.save(params.id, this.state.screening.toJS())
      .then((jsonResponse) => {
        this.setState({screening: Immutable.fromJS(jsonResponse)})
        this.show()
      })
  }

  setField(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    this.setState({screening: screening})
  }

  cardSave(fieldSeq, value) {
    const {params} = this.props
    const screening = this.state.screening.setIn(fieldSeq, value)
    return screeningActions.save(params.id, screening.toJS())
      .then((jsonResponse) => {
        this.setState({screening: Immutable.fromJS(jsonResponse)})
      })
  }

  addParticipant(participant) {
    const {screening} = this.state
    const participants = screening.get('participants') || Immutable.List()
    const newParticipant = Immutable.Map(participant)
    this.setField(['participants'], participants.push(newParticipant))
  }

  createParticipant(person) {
    const {params} = this.props
    const participant = Object.assign({}, person, {screening_id: params.id, person_id: person.id, id: null})
    participantActions.create(params.id, participant)
      .then((jsonResponse) => {
        this.addParticipant(jsonResponse)
      })
  }

  saveAll() {
    if (this.state.loaded) {
      const narrativeCardSave = this.refs.narrativeCard.onSave()
      narrativeCardSave.then(() => this.update())
    }
  }

  renderParticipantsCard() {
    const {screening} = this.state
    const participants = screening.get('participants') || Immutable.List()
    return (
      <div>
        <div className='card edit double-gap-top' id='participants-card'>
          <div className='card-header'>
            <span>Participants</span>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6'>
                <label className='no-gap' htmlFor='screening_participants'>Participants</label>
                <Autocompleter id='screening_participants' onSelect={this.createParticipant}/>
              </div>
            </div>
          </div>
        </div>
        {
          participants.map((participant) =>
            <ParticipantCardView key={participant.get('id')} participant={participant} mode='edit'/>
          )
        }
      </div>
    )
  }

  render() {
    const {screening, loaded} = this.state
    return (
      <div>
        <h1>{`Edit Screening #${screening.get('reference')}`}</h1>
        <InformationEditView screening={screening} onChange={this.setField} />
        {this.renderParticipantsCard()}
        {
          loaded &&
            <NarrativeCardView
              ref='narrativeCard'
              narrative={screening.get('report_narrative') || ''}
              mode='edit'
              onSave={(value) => this.cardSave(['report_narrative'], value)}
            />
        }
        <ReferralInformationEditView screening={screening} onChange={this.setField} />
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={this.saveAll}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningEditPage.propTypes = {
  actions: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  screening: React.PropTypes.object.isRequired,
}

function mapStateToProps(state, _ownProps) {
  return {screening: state.screening}
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningEditPage)

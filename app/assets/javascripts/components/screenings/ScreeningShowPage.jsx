import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'
import InformationShowView from 'components/screenings/InformationShowView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import ReferralInformationShowView from 'components/screenings/ReferralInformationShowView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningShowPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      screening: props.screening,
      loaded: false,
    }
    this.cardSave = this.cardSave.bind(this)
    this.setField = this.setField.bind(this)
  }

  componentDidMount() {
    this.props.actions.fetchScreening(this.props.params.id)
      .then(() => this.setState({loaded: true}))
  }

  componentWillReceiveProps(nextProps) {
    const screeningChanged = this.props.screening &&
      nextProps.screening &&
      this.props.screening.get('id') != nextProps.screening.get('id')
    if (screeningChanged) {
      this.setState({screening: nextProps.screening})
    }
  }

  cardSave(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    return this.props.actions.saveScreening(screening.toJS())
  }

  setField(fieldSeq, value) {
    const screening = this.state.screening.setIn(fieldSeq, value)
    this.setState({screening: screening})
  }

  renderParticipantsCard() {
    const {screening} = this.state
    const participants = screening.get('participants') || Immutable.List()
    return (
      <div>
        {
          participants.map((participant) =>
            <ParticipantCardView key={participant.get('id')} participant={participant} mode='show'/>
          )
        }
      </div>
    )
  }

  render() {
    const {params} = this.props
    const {screening, loaded} = this.state
    return (
      <div>
        <h1>{`Screening #${screening.get('reference')}`}</h1>
        <InformationShowView screening={screening}/>
        {this.renderParticipantsCard()}
        {loaded && <NarrativeCardView
          narrative={screening.get('report_narrative')}
          mode='show'
          onSave={(value) => this.cardSave(['report_narrative'], value)}
                   />}
        <ReferralInformationShowView screening={screening}/>
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${params.id}/edit`}>Edit</Link>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  params: React.PropTypes.object.isRequired,
  screening: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {screening: state.screening}
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningShowPage)

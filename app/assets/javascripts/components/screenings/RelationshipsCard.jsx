import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import nameFormatter from 'utils/nameFormatter'

export default class RelationshipsCard extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillReceiveProps(nextProps) {
    const {participants, actions, screeningId} = this.props
    if (participants !== nextProps.participants) {
      actions.fetchRelationshipsByScreeningId(screeningId)
    }
  }

  renderParticipantRelationships(participant) {
    const relationships = participant.get('relationships')

    if (_.isEmpty(relationships) || relationships.isEmpty()) {
      return (
        <strong> has no known relationships</strong>
      )
    } else {
      return (
        <span>
          <strong> is the...</strong>
          <ul className='relationships'>
            {
              relationships.map((relationship) =>
                <li key={relationship.get('related_person_id')} id={relationship.get('related_person_id')}>
                  <strong>{relationship.get('relationship')}</strong>
                  &nbsp;of {nameFormatter(relationship)}
                </li>
              )
            }
          </ul>
        </span>
      )
    }
  }

  renderRelationships() {
    const {relationships} = this.props
    if (_.isEmpty(relationships) || relationships.isEmpty()) {
      return (
        <div className='row'>
          Add people to see their relationships here.
        </div>
      )
    } else {
      return (
        relationships.map((participant, index) => this.renderParticipant(participant, index))
      )
    }
  }

  renderParticipant(participant, index) {
    return (
      <div className='row' key={index}>
        <div className='col-md-6 gap-top'>
          {nameFormatter(participant)}
          {this.renderParticipantRelationships(participant)}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div id='relationships-card' className='card show double-gap-top'>
        <div className='card-header'>
          <span>Relationships</span>
        </div>
        <div className='card-body no-pad-top'>
          {this.renderRelationships()}
        </div>
      </div>
    )
  }
}

RelationshipsCard.propTypes = {
  actions: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  relationships: PropTypes.object.isRequired,
  screeningId: PropTypes.string.isRequired,
}

import PropTypes from 'prop-types'
import React from 'react'
import nameFormatter from 'utils/nameFormatter'

export default class RelationshipsCard extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {participants, actions, screeningId} = this.props
    if (participants !== nextProps.participants) {
      actions.fetchRelationshipsByScreeningId(screeningId)
    }
  }

  renderParticipantRelationships(participant) {
    const relationships = participant.get('relationships')

    if (relationships.isEmpty()) {
      return (
        <strong> has no known relationships</strong>
      )
    } else {
      return (
        <span>
          <strong> is the...</strong>
          <ul className='relationships'>
            {
              relationships.map((relationship) => {
                const related_legacy_id = relationship.get('related_person_legacy_id')
                return (
                  <li
                    key={`${participant.get('id')}-${related_legacy_id}`}
                    id={`participant-${participant.get('id')}-relationship-${related_legacy_id}`}
                  >
                    <strong>{relationship.get('indexed_person_relationship')}</strong>
                    &nbsp;of {nameFormatter(relationship, {name_type: 'related_person'})}
                  </li>
                )
              })
            }
          </ul>
        </span>
      )
    }
  }

  renderRelationships() {
    const {relationships} = this.props
    if (relationships.isEmpty()) {
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

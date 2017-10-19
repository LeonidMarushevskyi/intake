import PropTypes from 'prop-types'
import React from 'react'
import nameFormatter from 'utils/nameFormatter'

export default class RelationshipsCard extends React.Component {
  componentDidMount() {
    const {actions, participants, screeningId} = this.props
    if (!participants.isEmpty()) {
      actions.fetchRelationships(screeningId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {participants, actions, screeningId} = this.props
    if (participants !== nextProps.participants) {
      actions.fetchRelationships(screeningId)
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
                    &nbsp;of {
                      nameFormatter({
                        first_name: relationship.get('related_person_first_name'),
                        middle_name: relationship.get('related_person_middle_name'),
                        last_name: relationship.get('related_person_last_name'),
                        name_suffix: relationship.get('related_person_name_suffix'),
                      })
                    }
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
          <div className='col-md-12'>
            <div className='double-gap-top  centered'>
              <a href='#search-card'>Search for people</a>
              <span className='c-dark-grey'> and add them to see their relationships.</span>
            </div>
          </div>
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
          {nameFormatter(participant.toJS())}
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

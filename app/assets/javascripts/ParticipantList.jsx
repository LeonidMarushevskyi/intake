import React from 'react'

export default class ParticipantList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul className='list-unstyled'>
        {this.props.participants.map((participant, i) => (
          <li key={participant.id} className='card double-gap-top' id={`participants-card-${participant.id}`}>
            <input type='hidden' name='screening[participant_ids][]' value={participant.id} />
            <div className='card-header'>
              <span>{`${participant.first_name} ${participant.last_name}`}</span>
            </div>
            <div className='card-body'>
            </div>
          </li>
        ))}
      </ul>
    )
  }
}

ParticipantList.propTypes = {
  participants: React.PropTypes.array,
}

ParticipantList.defaultProps = {
  participants: [],
}

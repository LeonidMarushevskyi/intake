import React from 'react'

export default class AutocompleterParticipantsList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul>
        {this.props.participants.map((person, i) => (
          <li key={i}>
            {person.first_name} {person.last_name}
            <input type='hidden' name='screening[participant_ids][]' value={person.id} />
          </li>
        ))}
      </ul>
    )
  }
}

AutocompleterParticipantsList.propTypes = {
  participants: React.PropTypes.array,
}

AutocompleterParticipantsList.defaultProps = {
  participants: [],
}

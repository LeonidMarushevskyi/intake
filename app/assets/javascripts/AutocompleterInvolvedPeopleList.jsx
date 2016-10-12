import React from 'react'

export default class AutocompleterInvolvedPeopleList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul>
        {this.props.involvedPeople.map((person, i) => (
          <li key={i}>
            {person.first_name} {person.last_name}
            <input type='hidden' name='screening[involved_person_ids][]' value={person.id} />
          </li>
        ))}
      </ul>
    )
  }
}

AutocompleterInvolvedPeopleList.propTypes = {
  involvedPeople: React.PropTypes.array,
}

AutocompleterInvolvedPeopleList.defaultProps = {
  involvedPeople: [],
}

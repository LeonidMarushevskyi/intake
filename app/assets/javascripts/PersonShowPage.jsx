import React from 'react'
import Immutable from 'immutable'

export default class PersonShowPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.Map({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        ssn: '',
        address: {
          street_address: '',
          city: '',
          state: '',
          zip: '',
        },
      }),
    }
  }

  render() {
    return (
      <div>Person Show</div>
    )
  }
}

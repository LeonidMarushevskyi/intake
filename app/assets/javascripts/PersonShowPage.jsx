import * as Utils from 'utils/http'
import Immutable from 'immutable'
import React from 'react'
import Gender from 'Gender'
import USState from 'USState'

export default class PersonShowPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.Map(),
    }
    this.fetch = this.fetch.bind(this)
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    const {params} = this.props
    const xhr = Utils.request('GET', `/people/${params.id}.json`)
    xhr.done((xhrResp) => {
      this.setState({person: Immutable.fromJS(xhrResp.responseJSON)})
    })
  }

  render() {
    const {person} = this.state
    return (
      <div className='card double-gap-top'>
        <div className='card-header'>
          <span>Profile Information</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap'>First Name</label>
              <div className='c-gray'>{person.get('first_name')}</div>
            </div>
            <div className='col-md-6'>
              <label className='no-gap-top-desktop'>Last Name</label>
              <div className='c-gray'>{person.get('last_name')}</div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Gender</label>
              <div className='c-gray'>{Gender[person.get('gender')]}</div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Date of birth</label>
              <div className='c-gray'>{person.get('date_of_birth')}</div>
            </div>
            <div className='col-md-6'>
              <label>Social security number</label>
              <div className='c-gray'>{person.get('ssn')}</div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Address</label>
              <div className='c-gray'>{person.getIn(['address', 'street_address'])}</div>
            </div>
            <div className='col-md-6'>
              <label>City</label>
              <div className='c-gray'>{person.getIn(['address', 'city'])}</div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>State</label>
              <div className='c-gray'>{USState[person.getIn(['address', 'state'])]}</div>
            </div>
            <div className='col-md-6'>
              <label>Zip</label>
              <div className='c-gray'>{person.getIn(['address', 'zip'])}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PersonShowPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

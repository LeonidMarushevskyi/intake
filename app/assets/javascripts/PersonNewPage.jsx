import * as Utils from 'utils/http'
import Gender from 'Gender'
import Immutable from 'immutable'
import React from 'react'
import USState from 'USState'
import {browserHistory} from 'react-router'

export default class PersonNewPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.fromJS({
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
    this.update = this.update.bind(this)
    this.save = this.save.bind(this)
  }

  update(fieldSeq, value) {
    const person = this.state.person.setIn(fieldSeq, value)
    this.setState({person: person})
  }

  save() {
    const url = `/people.json`
    const xhr = Utils.request('POST', url, {person: this.state.person.toJS()}, null)
    xhr.done((xhrResp) => {
      this.setState({person: Immutable.fromJS(xhrResp.responseJSON)})
      browserHistory.push({
        pathname: `/people/${xhrResp.responseJSON.id}`,
      })
    })
  }

  render() {
    return (
      <div className='card edit double-gap-top'>
        <div className='card-header'>
          <span>Create New Person</span>
          <a className='fa fa-check' href='#' aria-label='Done editing profile' />
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap' htmlFor='first_name'>First Name</label>
              <input
                type='text'
                id='first_name'
                onChange={(event) => this.update(['first_name'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label className='no-pad-top-desktop' htmlFor='last_name'>Last Name</label>
              <input
                type='text'
                id='last_name'
                onChange={(event) => this.update(['last_name'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='gender'>Gender</label>
              <select id='gender'
                onChange={(event) => this.update(['gender'], event.target.value)}
              >
                <option key='' value=''></option>
                {Object.keys(Gender).map((item) => <option key={item} value={item}>{Gender[item]}</option>)}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='date_of_birth'>Date of birth</label>
              <input
                type='date'
                id='date_of_birth'
                onChange={(event) => this.update(['date_of_birth'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='ssn'>Social security number</label>
              <input
                type='text'
                id='ssn'
                onChange={(event) => this.update(['ssn'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='street_address'>Address</label>
              <input
                type='text'
                id='street_address'
                onChange={(event) => this.update(['address', 'street_address'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                id='city'
                onChange={(event) => this.update(['address', 'city'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='state'>State</label>
              <select
                id='state'
                onChange={(event) => this.update(['address', 'state'], event.target.value)}
              >
                <option key= '' value=''></option>
                {Object.keys(USState).map((item) => <option key={item} value={item}>{USState[item]}</option>)}
              </select>
            </div>
            <div className='col-md-6'>
              <label htmlFor='zip'>Zip</label>
              <input
                type='text'
                id='zip'
                onChange={(event) => this.update(['address', 'zip'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='centered'>
              <input type='submit' value='Save' onClick={this.save} />
            </div>
          </div>
      </div>
    </div>
    )
  }
}

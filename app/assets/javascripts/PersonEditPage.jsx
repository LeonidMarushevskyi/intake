import * as Utils from 'utils/http'
import Gender from 'Gender'
import Immutable from 'immutable'
import React from 'react'
import USState from 'USState'
import {Link, browserHistory} from 'react-router'

export default class PersonEditPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.Map(),
    }
    this.fetch = this.fetch.bind(this)
    this.save = this.save.bind(this)
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

  save() {
    const {params} = this.props
    const url = `/people/${params.id}.json`
    const xhr = Utils.request('PUT', url, {person: this.state.person.toJS()}, null)
    xhr.done((xhrResp) => {
      this.setState({person: Immutable.fromJS(xhrResp.responseJSON)})
      this.show()
    })
  }

  show() {
    const {params} = this.props
    browserHistory.push({
      pathname: `/people/${params.id}`,
    })
  }

  update(fieldSeq, value) {
    const person = this.state.person.setIn(fieldSeq, value)
    this.setState({person: person})
  }

  render() {
    const {params} = this.props
    const {person} = this.state
    return (
      <div className='card edit double-gap-top'>
        <div className='card-header'>
          <span>Edit Person</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap' htmlFor='first_name'>First Name</label>
              <input
                type='text'
                id='first_name'
                value={person.get('first_name') || ''}
                onChange={(event) => this.update(['first_name'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label className='no-pad-top-desktop' htmlFor='last_name'>Last Name</label>
              <input
                type='text'
                id='last_name'
                value={person.get('last_name') || ''}
                onChange={(event) => this.update(['last_name'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='gender'>Gender</label>
              <select
                id='gender'
                value={person.get('gender') || ''}
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
                className='input-type-date'
                id='date_of_birth'
                value={person.get('date_of_birth') || ''}
                onChange={(event) => this.update(['date_of_birth'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='ssn'>Social security number</label>
              <input
                type='text'
                id='ssn'
                value={person.get('ssn') || ''}
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
                value={person.getIn(['address', 'street_address']) || ''}
                onChange={(event) => this.update(['address', 'street_address'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                id='city'
                value={person.getIn(['address', 'city']) || ''}
                onChange={(event) => this.update(['address', 'city'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='state'>State</label>
              <select
                id='state'
                value={person.getIn(['address', 'state']) || ''}
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
                value={person.getIn(['address', 'zip']) || ''}
                onChange={(event) => this.update(['address', 'zip'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='centered'>
              <button className='btn btn-primary' onClick={this.save} >Save</button>
              <Link className='btn btn-default' to={`/people/${params.id}`}>Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PersonEditPage.propTypes = {
  params: React.PropTypes.object.isRequired,
}

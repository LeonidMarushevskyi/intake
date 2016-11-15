import * as personActions from 'actions/personActions'
import GENDER from 'Gender'
import Immutable from 'immutable'
import React from 'react'
import US_STATE from 'USState'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

export class PersonNewPage extends React.Component {
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
    this.setField = this.setField.bind(this)
    this.save = this.save.bind(this)
  }

  setField(fieldSeq, value) {
    const person = this.state.person.setIn(fieldSeq, value)
    this.setState({person: person})
  }

  show() {
    const {person} = this.props
    browserHistory.push({
      pathname: `/people/${person.get('id')}`,
    })
  }

  save() {
    this.props.actions.createPerson({person: this.state.person.toJS()})
      .then(() => this.show())
  }

  render() {
    return (
      <div className='card edit double-gap-top'>
        <div className='card-header'>
          <span>Basic Demographics card</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap' htmlFor='first_name'>First Name</label>
              <input
                type='text'
                id='first_name'
                onChange={(event) => this.setField(['first_name'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label className='no-gap-top-desktop' htmlFor='last_name'>Last Name</label>
              <input
                type='text'
                id='last_name'
                onChange={(event) => this.setField(['last_name'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='date_of_birth'>Date of birth</label>
              <input
                type='date'
                className='input-type-date'
                id='date_of_birth'
                onChange={(event) => this.setField(['date_of_birth'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='gender'>Gender</label>
              <select id='gender'
                onChange={(event) => this.setField(['gender'], event.target.value)}
              >
                <option key='' value=''></option>
                {Object.keys(GENDER).map((item) => <option key={item} value={item}>{GENDER[item]}</option>)}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='ssn'>Social security number</label>
              <input
                type='text'
                id='ssn'
                onChange={(event) => this.setField(['ssn'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='street_address'>Address</label>
              <input
                type='text'
                id='street_address'
                onChange={(event) => this.setField(['address', 'street_address'], event.target.value)}
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                id='city'
                onChange={(event) => this.setField(['address', 'city'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='state'>State</label>
              <select
                id='state'
                onChange={(event) => this.setField(['address', 'state'], event.target.value)}
              >
                <option key= '' value=''></option>
                {Object.keys(US_STATE).map((item) => <option key={item} value={item}>{US_STATE[item]}</option>)}
              </select>
            </div>
            <div className='col-md-6'>
              <label htmlFor='zip'>Zip</label>
              <input
                type='text'
                id='zip'
                onChange={(event) => this.setField(['address', 'zip'], event.target.value)}
              />
            </div>
          </div>
          <div className='row'>
            <div className='centered'>
              <button className='btn btn-primary' onClick={this.save}>Save</button>
            </div>
          </div>
      </div>
    </div>
    )
  }
}

PersonNewPage.propTypes = {
  person: React.PropTypes.object,
  actions: React.PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {person: state.person}
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: bindActionCreators(personActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonNewPage)

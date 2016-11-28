import * as personActions from 'actions/personActions'
import DateField from 'components/common/DateField'
import GENDER from 'Gender'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import React from 'react'
import NAME_SUFFIX from 'NameSuffix'
import SelectField from 'components/common/SelectField'
import US_STATE from 'USState'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

export class PersonNewPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.fromJS({
        first_name: null,
        middle_name: null,
        last_name: null,
        name_suffix: null,
        gender: null,
        date_of_birth: null,
        ssn: null,
        address: {
          street_address: null,
          city: null,
          state: null,
          zip: null,
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
            <InputField
              gridClassName='col-md-3'
              labelClassName='no-gap'
              id='first_name'
              label='First Name'
              onChange={(event) => this.setField(['first_name'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-3'
              labelClassName='no-gap'
              id='middle_name'
              label='Middle Name'
              onChange={(event) => this.setField(['middle_name'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-3'
              labelClassName='no-gap'
              id='last_name'
              label='Last Name'
              onChange={(event) => this.setField(['last_name'], event.target.value)}
            />
            <SelectField
              gridClassName='col-md-3'
              labelClassName='no-gap-top-desktop'
              id='name_suffix'
              label='Suffix'
              onChange={(event) => this.setField(['name_suffix'], event.target.value)}
            >
              <option key='' value=''></option>
              {Object.keys(NAME_SUFFIX).map((item) => <option key={item} value={item}>{NAME_SUFFIX[item]}</option>)}
            </SelectField>
          </div>
          <div className='row'>
            <DateField
              gridClassName='col-md-6'
              id='date_of_birth'
              label='Date of birth'
              onChange={(event) => this.setField(['date_of_birth'], event.target.value)}
            />
            <SelectField
              gridClassName='col-md-6'
              id='gender'
              label='Gender'
              onChange={(event) => this.setField(['gender'], event.target.value)}
            >
              <option key='' value=''></option>
              {Object.keys(GENDER).map((item) => <option key={item} value={item}>{GENDER[item]}</option>)}
            </SelectField>
          </div>
          <div className='row'>
            <InputField
              gridClassName='col-md-6'
              id='ssn'
              label='Social security number'
              onChange={(event) => this.setField(['ssn'], event.target.value)}
            />
          </div>
          <div className='row'>
            <InputField
              gridClassName='col-md-6'
              id='street_address'
              label='Address'
              onChange={(event) => this.setField(['address', 'street_address'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-6'
              id='city'
              label='City'
              onChange={(event) => this.setField(['address', 'city'], event.target.value)}
            />
          </div>
          <div className='row'>
            <SelectField
              gridClassName='col-md-6'
              id='state'
              label='State'
              onChange={(event) => this.setField(['address', 'state'], event.target.value)}
            >
              <option key='' value=''></option>
              {Object.keys(US_STATE).map((item) => <option key={item} value={item}>{US_STATE[item]}</option>)}
            </SelectField>
            <InputField
              gridClassName='col-md-6'
              id='zip'
              label='Zip'
              onChange={(event) => this.setField(['address', 'zip'], event.target.value)}
            />
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

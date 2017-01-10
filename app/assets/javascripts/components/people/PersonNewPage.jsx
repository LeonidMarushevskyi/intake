import * as personActions from 'actions/personActions'
import DateField from 'components/common/DateField'
import GENDER from 'Gender'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import LANGUAGE from 'Language'
import NAME_SUFFIX from 'NameSuffix'
import React from 'react'
import Select from 'react-select'
import SelectField from 'components/common/SelectField'
import AddressesEditView from 'components/people/AddressesEditView'
import PhoneNumbersEditView from 'components/people/PhoneNumbersEditView'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'
import selectOptions from 'utils/selectHelper'

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
        addresses: [],
        phone_numbers: [],
        languages: [],
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
    this.props.actions.createPerson(this.state.person.toJS())
      .then(() => this.show())
  }

  render() {
    const {person} = this.state
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
              onChange={(event) => this.setField(['name_suffix'], event.target.value || null)}
            >
              <option key='' />
              {Object.keys(NAME_SUFFIX).map((item) => <option key={item} value={item}>{NAME_SUFFIX[item]}</option>)}
            </SelectField>
          </div>
          <PhoneNumbersEditView
            phoneNumbers={this.state.person.get('phone_numbers') || Immutable.List()}
            onChange={(phoneNumbers) => this.setField(['phone_numbers'], phoneNumbers)}
          />
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
              onChange={(event) => this.setField(['gender'], event.target.value || null)}
            >
              <option key='' />
              {Object.keys(GENDER).map((item) => <option key={item} value={item}>{GENDER[item]}</option>)}
            </SelectField>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='languages'>Language(s)</label>
              <Select
                multi
                inputProps={{id: 'languages'}}
                options={selectOptions(LANGUAGE)}
                value={person.get('languages').toJS()}
                onChange={(languages) => this.setField(
                  ['languages'],
                  Immutable.List(languages.map((language) => language.value))
                )}
              />
            </div>
          </div>
          <div className='row'>
            <InputField
              gridClassName='col-md-6'
              id='ssn'
              label='Social security number'
              onChange={(event) => this.setField(['ssn'], event.target.value)}
            />
          </div>
          <AddressesEditView
            addresses={this.state.person.get('addresses') || Immutable.List()}
            onChange={(addresses) => this.setField(['addresses'], addresses)}
          />
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
  actions: React.PropTypes.object.isRequired,
  person: React.PropTypes.object,
}

function mapStateToProps(state, _ownProps) {
  return {person: state.person}
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(personActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonNewPage)

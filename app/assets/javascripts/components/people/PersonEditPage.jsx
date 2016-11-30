import * as personActions from 'actions/personActions'
import DateField from 'components/common/DateField'
import GENDER from 'Gender'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import NAME_SUFFIX from 'NameSuffix'
import React from 'react'
import SelectField from 'components/common/SelectField'
import US_STATE from 'USState'
import {Link, browserHistory} from 'react-router'
import {PhoneNumbersEditView} from 'components/people/PhoneNumbersEditView'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class PersonEditPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      person: Immutable.Map(),
    }
    this.setField = this.setField.bind(this)
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    const personId = this.props.params.id
    this.props.actions.fetchPerson(personId)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({person: nextProps.person})
  }

  update() {
    this.props.actions.updatePerson({person: this.state.person.toJS()})
      .then(() => this.show())
  }

  show() {
    const {params} = this.props
    browserHistory.push({
      pathname: `/people/${params.id}`,
    })
  }

  setField(fieldSeq, value) {
    const person = this.state.person.setIn(fieldSeq, value)
    this.setState({person: person})
  }

  render() {
    const {params} = this.props
    const {person} = this.state
    return (
      <div className='card edit double-gap-top'>
        <div className='card-header'>
          <span>Edit Basic Demographics Card</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <InputField
              gridClassName='col-md-3'
              labelClassName='no-gap'
              id='first_name'
              label='First Name'
              value={person.get('first_name') || ''}
              onChange={(event) => this.setField(['first_name'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-3'
              labelClassName='no-gap'
              id='middle_name'
              label='Middle Name'
              value={person.get('middle_name') || ''}
              onChange={(event) => this.setField(['middle_name'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-3'
              labelClassName='no-gap'
              id='last_name'
              label='Last Name'
              value={person.get('last_name') || ''}
              onChange={(event) => this.setField(['last_name'], event.target.value)}
            />
            <SelectField
              gridClassName='col-md-3'
              labelClassName='no-gap-top-desktop'
              id='name_suffix'
              label='Suffix'
              value={person.get('name_suffix') || ''}
              onChange={(event) => this.setField(['name_suffix'], event.target.value)}
            >
              <option key='' value=''></option>
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
              value={person.get('date_of_birth') || ''}
              onChange={(event) => this.setField(['date_of_birth'], event.target.value)}
            />
            <SelectField
              gridClassName='col-md-6'
              id='gender'
              label='Gender'
              value={person.get('gender') || ''}
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
              value={person.get('ssn') || ''}
              onChange={(event) => this.setField(['ssn'], event.target.value)}
            />
          </div>
          <div className='row'>
            <InputField
              gridClassName='col-md-6'
              id='street_address'
              label='Address'
              value={person.getIn(['address', 'street_address']) || ''}
              onChange={(event) => this.setField(['address', 'street_address'], event.target.value)}
            />
            <InputField
              gridClassName='col-md-6'
              id='city'
              label='City'
              value={person.getIn(['address', 'city']) || ''}
              onChange={(event) => this.setField(['address', 'city'], event.target.value)}
            />
          </div>
          <div className='row'>
            <SelectField
              gridClassName='col-md-6'
              id='state'
              label='State'
              value={person.getIn(['address', 'state']) || ''}
              onChange={(event) => this.setField(['address', 'state'], event.target.value)}
            >
              <option key='' value=''></option>
              {Object.keys(US_STATE).map((item) => <option key={item} value={item}>{US_STATE[item]}</option>)}
            </SelectField>
            <InputField
              gridClassName='col-md-6'
              id='zip'
              label='Zip'
              value={person.getIn(['address', 'zip']) || ''}
              onChange={(event) => this.setField(['address', 'zip'], event.target.value)}
            />
          </div>
          <div className='row'>
            <div className='centered'>
              <button className='btn btn-primary' onClick={this.update} >Save</button>
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
  person: React.PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonEditPage)

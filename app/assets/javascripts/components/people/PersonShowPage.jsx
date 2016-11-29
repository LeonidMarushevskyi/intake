import * as personActions from 'actions/personActions'
import Gender from 'Gender'
import Immutable from 'immutable'
import NAME_SUFFIX from 'NameSuffix'
import PHONE_NUMBER_TYPE from 'PhoneNumberType'
import React from 'react'
import ShowField from 'components/common/ShowField'
import US_STATE from 'USState'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class PersonShowPage extends React.Component {
  constructor() {
    super(...arguments)
  }

  componentDidMount() {
    this.props.actions.fetchPerson(this.props.params.id)
  }

  render() {
    const {params, person} = this.props

    return (
      <div className='card double-gap-top'>
        <div className='card-header'>
          <span>Basic Demographics Card</span>
          <Link to={`/people/${params.id}/edit`} aria-label='Edit Person'>
            <i className='fa fa-pencil'></i>
          </Link>
        </div>
        <div className='card-body'>
          <div className='row'>
            <ShowField gridClassName='col-md-3' labelClassName='no-gap' label='First Name'>
              {person.get('first_name')}
            </ShowField>
            <ShowField gridClassName='col-md-3' labelClassName='no-gap' label='Middle Name'>
              {person.get('middle_name')}
            </ShowField>
            <ShowField gridClassName='col-md-3' labelClassName='no-gap' label='Last Name'>
              {person.get('last_name')}
            </ShowField>
            <ShowField gridClassName='col-md-3' labelClassName='no-gap-top-desktop' label='Suffix'>
              {NAME_SUFFIX[person.get('name_suffix')]}
            </ShowField>
          </div>
          <div className='row gap-top'>
            {
              person.get('phone_numbers') && person.get('phone_numbers').map((phoneNumber) => (
                <div key={phoneNumber.get('id')}>
                  <ShowField gridClassName='col-md-6' label='Phone Number'>
                    {phoneNumber.get('phone_number')}
                  </ShowField>
                  <ShowField gridClassName='col-md-6' label='Phone Number Type'>
                    {PHONE_NUMBER_TYPE[phoneNumber.get('phone_number_type')]}
                  </ShowField>
                </div>
              ))
            }
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-6' label='Date of birth'>
              {person.get('date_of_birth')}
            </ShowField>
            <ShowField gridClassName='col-md-6' label='Gender'>
              {Gender[person.get('gender')]}
            </ShowField>
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-6' label='Social security number'>
              {person.get('ssn')}
            </ShowField>
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-6' label='Address'>
              {person.getIn(['address', 'street_address'])}
            </ShowField>
            <ShowField gridClassName='col-md-6' label='City'>
              {person.getIn(['address', 'city'])}
            </ShowField>
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-6' label='State'>
              {US_STATE[person.getIn(['address', 'state'])]}
            </ShowField>
            <ShowField gridClassName='col-md-6' label='Zip'>
              {person.getIn(['address', 'zip'])}
            </ShowField>
          </div>
        </div>
      </div>
    )
  }
}

PersonShowPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonShowPage)

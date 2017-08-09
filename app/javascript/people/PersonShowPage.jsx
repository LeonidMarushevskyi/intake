import * as personActions from 'actions/personActions'
import Genders from 'enums/Genders'
import React from 'react'
import PropTypes from 'prop-types'
import NAME_SUFFIXES from 'enums/NameSuffixes'
import ShowField from 'common/ShowField'
import US_STATE from 'enums/USState'
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
    const {languages, races, ethnicity} = person.toJS()
    const {hispanic_latino_origin, ethnicity_detail} = ethnicity || {}

    return (
      <div className='card double-gap-top'>
        <div className='card-header'>
          <span>Basic Demographics Card</span>
          <Link to={`/people/${params.id}/edit`} aria-label='Edit Person'>
            <i className='fa fa-pencil' />
          </Link>
        </div>
        <div className='card-body'>
          <div className='row'>
            <ShowField gridClassName='col-md-3' label='First Name'>
              {person.get('first_name')}
            </ShowField>
            <ShowField gridClassName='col-md-3' label='Middle Name'>
              {person.get('middle_name')}
            </ShowField>
            <ShowField gridClassName='col-md-3' label='Last Name'>
              {person.get('last_name')}
            </ShowField>
            <ShowField gridClassName='col-md-3' label='Suffix'>
              {NAME_SUFFIXES[person.get('name_suffix')]}
            </ShowField>
          </div>
          <div>
            {
              person.get('phone_numbers') && person.get('phone_numbers').map((phoneNumber) => (
                <div key={phoneNumber.get('id')} className='row gap-top'>
                  <ShowField gridClassName='col-md-6' label='Phone Number'>
                    {phoneNumber.get('number')}
                  </ShowField>
                  <ShowField gridClassName='col-md-6' label='Phone Number Type'>
                    {phoneNumber.get('type')}
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
              {Genders[person.get('gender')]}
            </ShowField>
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-12' label='Language(s)'>
              {(languages || []).join(', ')}
            </ShowField>
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-6' label='Social security number'>
              {person.get('ssn')}
            </ShowField>
          </div>
          <div>
            {
              person.get('addresses') && person.get('addresses').map((address) => {
                const state = US_STATE.find((state) => state.code === address.get('state'))
                return (<div key={address.get('id')}>
                  <div className='row gap-top'>
                    <ShowField gridClassName='col-md-6' label='Address'>
                      {address.get('street_address')}
                    </ShowField>
                    <ShowField gridClassName='col-md-6' label='City'>
                      {address.get('city')}
                    </ShowField>
                  </div>
                  <div className='row'>
                    <ShowField gridClassName='col-md-4' label='State'>
                      {state ? state.name : ''}
                    </ShowField>
                    <ShowField gridClassName='col-md-2' label='Zip'>
                      {address.get('zip')}
                    </ShowField>
                    <ShowField gridClassName='col-md-6' label='Address Type'>
                      {address.get('type')}
                    </ShowField>
                  </div>
                </div>
                )
              })
            }
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-12' label='Race'>
              {races &&
                races.map(({race, race_detail}) => {
                  const raceDetailText = (race_detail && ` - ${race_detail}`) || ''
                  return `${race}${raceDetailText}`
                }).join(', ')}
            </ShowField>
          </div>
          <div className='row gap-top'>
            <ShowField gridClassName='col-md-12' label='Hispanic/Latino Origin'>
              {hispanic_latino_origin &&
                `${hispanic_latino_origin}${(ethnicity_detail && ` - ${ethnicity_detail}`) || ''}`
              }
              </ShowField>
            </div>
        </div>
      </div>
    )
  }
}

PersonShowPage.propTypes = {
  actions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
}

function mapStateToProps(state, _ownProps) {
  return {person: state.person}
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(personActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonShowPage)

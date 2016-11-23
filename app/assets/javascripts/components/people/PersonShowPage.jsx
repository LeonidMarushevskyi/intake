import * as personActions from 'actions/personActions'
import Gender from 'Gender'
import Immutable from 'immutable'
import React from 'react'
import SUFFIX from 'Suffix'
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
            <div className='col-md-3'>
              <label className='no-gap'>First Name</label>
              <div className='c-gray'>{person.get('first_name')}</div>
            </div>
            <div className='col-md-3'>
              <label className='no-gap'>Middle Name</label>
              <div className='c-gray'>{person.get('middle_name')}</div>
            </div>
            <div className='col-md-3'>
              <label className='no-gap'>Last Name</label>
              <div className='c-gray'>{person.get('last_name')}</div>
            </div>
            <div className='col-md-3'>
              <label className='no-gap-top-desktop'>Suffix</label>
              <div className='c-gray'>{SUFFIX[person.get('suffix')]}</div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Date of birth</label>
              <div className='c-gray'>{person.get('date_of_birth')}</div>
            </div>
            <div className='col-md-6'>
              <label>Gender</label>
              <div className='c-gray'>{Gender[person.get('gender')]}</div>
            </div>
          </div>
          <div className='row gap-top'>
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
              <div className='c-gray'>{US_STATE[person.getIn(['address', 'state'])]}</div>
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

import Gender from 'Gender'
import React from 'react'
import moment from 'moment'

const AgeInfo = ({dateOfBirth}) => {
  const dob = moment(dateOfBirth, 'YYYY-MM-DD')
  const ageInYears = dob.isValid() && moment().diff(dob, 'years')
  return (
    dob.isValid() && <div>{`${ageInYears} yrs old (${dob.format('M/D/YYYY')})`}</div>
  )
}

const AddressInfo = (address) => {
  const {type, streetAddress, city, state, zip} = address
  const stateZip = [state, zip].filter(Boolean).join(' ')
  return (
    <div>
      <i className='fa fa-map-marker c-gray half-pad-right' />
      {type && <strong className='c-gray half-pad-right'>{type}</strong>}
      <span>{[streetAddress, city, stateZip].filter(Boolean).join(', ')}</span>
    </div>
  )
}

const PersonSuggestion = ({firstName, lastName, dateOfBirth, gender, ssn, address}) => (
  <div className='row'>
    <div className='col-md-2'>
      <img src='/assets/default-profile.svg' />
    </div>
    <div className='col-md-4'>
      <strong>{[firstName, lastName].filter(Boolean).join(' ')}</strong>
      <AgeInfo dateOfBirth={dateOfBirth} />
      {gender && <div>{Gender[gender]}</div>}
      {ssn && <div><strong className='c-gray half-pad-right'>SSN</strong><span>{ssn}</span></div>}
    </div>
    {address &&
      <div className='col-md-6'>
        <AddressInfo {...address} />
      </div>
    }
  </div>
)

PersonSuggestion.propTypes = {
  address: React.PropTypes.shape({
    city: React.PropTypes.string,
    state: React.PropTypes.string,
    streetAddress: React.PropTypes.string,
    type: React.PropTypes.string,
    zip: React.PropTypes.string,
  }),
  dateOfBirth: React.PropTypes.string,
  firstName: React.PropTypes.string,
  gender: React.PropTypes.string,
  lastName: React.PropTypes.string,
  ssn: React.PropTypes.string,
}
export default PersonSuggestion

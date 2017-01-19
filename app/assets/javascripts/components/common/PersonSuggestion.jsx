import Gender from 'Gender'
import React from 'react'
import moment from 'moment'

const AgeInfo = ({dateOfBirth}) => {
  const dob = moment.utc(dateOfBirth, 'YYYY-MM-DD')
  const ageInYears = dob.isValid() && moment().diff(dob, 'years')
  return (
    dob.isValid() && <div>{`${ageInYears} yrs old (DOB: ${dob.format('M/D/YYYY')})`}</div>
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

const GenderAndRace = ({gender, races}) => {
  const racesText = races && races.map(({race}) => race)
  const genderAndRace = [Gender[gender]].concat(racesText).filter(Boolean).join(', ')
  return (
    genderAndRace ? <div>{genderAndRace}</div> : null
  )
}

const PersonSuggestion = ({firstName, lastName, dateOfBirth, gender, races, ssn, address}) => (
  <div className='row'>
    <div className='col-md-2'>
      <img src='/assets/default-profile.svg' />
    </div>
    <div className='col-md-4'>
      <strong>{[firstName, lastName].filter(Boolean).join(' ')}</strong>
      <GenderAndRace gender={gender} races={races} />
      <AgeInfo dateOfBirth={dateOfBirth} />
      {ssn && <div><strong className='c-gray half-pad-right'>SSN</strong><span>{ssn}</span></div>}
    </div>
    {address &&
      <div className='col-md-6'>
        <AddressInfo {...address} />
      </div>
    }
  </div>
)

GenderAndRace.propTypes = {
  gender: React.PropTypes.string,
  races: React.PropTypes.array,
}

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
  races: React.PropTypes.array,
  ssn: React.PropTypes.string,
}

export default PersonSuggestion

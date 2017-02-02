import AddressInfo from 'components/common/AddressInfo'
import AgeInfo from 'components/common/AgeInfo'
import GenderRaceAndEthnicity from 'components/common/GenderRaceAndEthnicity'
import Languages from 'components/common/LanguageInfo'
import React from 'react'

const PersonSuggestion = ({firstName, lastName, dateOfBirth, gender, languages, races, ethnicity, ssn, address}) => (
  <div className='row'>
    <div className='col-md-2'>
      <img src='/assets/default-profile.svg' />
    </div>
    <div className='col-md-4'>
      <strong>{[firstName, lastName].filter(Boolean).join(' ')}</strong>
      <GenderRaceAndEthnicity gender={gender} races={races} ethnicity={ethnicity} />
      <AgeInfo dateOfBirth={dateOfBirth} />
      <Languages languages={languages} />
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
  ethnicity: React.PropTypes.object,
  firstName: React.PropTypes.string,
  gender: React.PropTypes.string,
  languages: React.PropTypes.array,
  lastName: React.PropTypes.string,
  races: React.PropTypes.array,
  ssn: React.PropTypes.string,
}

export default PersonSuggestion

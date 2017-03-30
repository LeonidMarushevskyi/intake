import AddressInfo from 'components/common/AddressInfo'
import AgeInfo from 'components/common/AgeInfo'
import GenderRaceAndEthnicity from 'components/common/GenderRaceAndEthnicity'
import Languages from 'components/common/LanguageInfo'
import NAME_SUFFIX from 'NameSuffix'
import React from 'react'
import PhoneNumberInfo from 'components/common/PhoneNumberInfo'
import sanitizeHtml from 'sanitize-html'

const PersonSuggestion = ({firstName, lastName, middleName, nameSuffix, dateOfBirth, gender, languages, races, ethnicity, ssn, address, phoneNumber}) => {
  const fullName = [firstName, middleName, lastName, NAME_SUFFIX[nameSuffix]].filter(Boolean).join(' ')
  const sanitizedField = (field) => ({
    dangerouslySetInnerHTML: {
      __html: sanitizeHtml(field, {allowedTags: ['em']}),
    },
  })
  return (
    <div className='row'>
      <div className='col-md-2'>
        <img src='/assets/default-profile.svg' />
      </div>
      <div className='col-md-4'>
        <strong {...sanitizedField(fullName)} />
          <GenderRaceAndEthnicity gender={gender} races={races} ethnicity={ethnicity} />
          <AgeInfo dateOfBirth={dateOfBirth} />
          <Languages languages={languages} />
          {
            ssn && <div>
              <strong className='c-gray half-pad-right'>SSN</strong>
              <span {...sanitizedField(ssn)} />
            </div>
          }
        </div>
        <div className='col-md-6'>
          {address && <AddressInfo {...address} /> }
          {phoneNumber && <PhoneNumberInfo {...phoneNumber} />}
        </div>
      </div>
  )
}

PersonSuggestion.propTypes = {
  address: React.PropTypes.object,
  dateOfBirth: React.PropTypes.string,
  ethnicity: React.PropTypes.object,
  firstName: React.PropTypes.string,
  gender: React.PropTypes.string,
  languages: React.PropTypes.array,
  lastName: React.PropTypes.string,
  middleName: React.PropTypes.string,
  nameSuffix: React.PropTypes.string,
  phoneNumber: React.PropTypes.object,
  races: React.PropTypes.array,
  ssn: React.PropTypes.string,
}

export default PersonSuggestion

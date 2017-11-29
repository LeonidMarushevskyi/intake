import PersonCardContainer from 'containers/screenings/PersonCardContainer'
import PersonDemographicsFormContainer from 'containers/screenings/PersonDemographicsFormContainer'
import PersonRaceFormContainer from 'containers/screenings/PersonRaceFormContainer'
import PersonEthnicityFormContainer from 'containers/screenings/PersonEthnicityFormContainer'
import PersonPhoneNumbersContainer from 'containers/screenings/PersonPhoneNumbersContainer'
import PersonPhoneNumbersFormContainer from 'containers/screenings/PersonPhoneNumbersFormContainer'
import PersonShowContainer from 'containers/screenings/PersonShowContainer'
import PersonAddressesContainer from 'containers/screenings/PersonAddressesContainer'
import PersonAddressesFormContainer from 'containers/screenings/PersonAddressesFormContainer'
import PersonFormContainer from 'containers/screenings/PersonFormContainer'
import PropTypes from 'prop-types'
import React from 'react'

const PersonCardView = ({participant}) => {
  const personId = participant.get('id')
  return (
    <PersonCardContainer
      personId={personId}
      edit={
        <div>
          <PersonFormContainer personId={personId} />
          <PersonDemographicsFormContainer personId={personId} />
          <PersonRaceFormContainer personId={personId} />
          <PersonEthnicityFormContainer personId={personId} />
          <PersonPhoneNumbersFormContainer personId={personId} />
          <PersonAddressesFormContainer personId={personId} />
        </div>
      }
      show={
        <div>
          <PersonShowContainer personId={personId} />
          <PersonPhoneNumbersContainer personId={personId} />
          <PersonAddressesContainer personId={personId} />
        </div>
      }
    />
  )
}

PersonCardView.propTypes = {
  participant: PropTypes.object.isRequired,
}

export default PersonCardView

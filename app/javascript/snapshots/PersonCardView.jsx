import PropTypes from 'prop-types'
import React from 'react'
import PersonCardContainer from 'containers/snapshot/PersonCardContainer'
import PersonPhoneNumbersContainer from 'containers/screenings/PersonPhoneNumbersContainer'
import PersonShowContainer from 'containers/screenings/PersonShowContainer'
import PersonAddressesContainer from 'containers/screenings/PersonAddressesContainer'

const PersonCardView = ({personId}) => (
  <PersonCardContainer
    personId={personId}
    show={
      <div>
        <PersonShowContainer personId={personId} />
        <PersonPhoneNumbersContainer personId={personId} />
        <PersonAddressesContainer personId={personId} />
      </div>
    }
  />
)

PersonCardView.propTypes = {
  personId: PropTypes.string.isRequired,
}

export default PersonCardView


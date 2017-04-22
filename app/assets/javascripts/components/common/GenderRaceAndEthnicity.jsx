import React from 'react'
import PropTypes from 'prop-types'
import Gender from 'Gender'

const GenderRaceAndEthnicity = ({gender, races, ethnicity}) => {
  const racesText = races && races.map(({race}) => race)
  const origin = ethnicity && ethnicity.hispanic_latino_origin
  const ethnicityValue = (origin === 'Yes') ? 'Hispanic/Latino' : null
  const genderRaceAndEthnicity = [Gender[gender]].concat(racesText, ethnicityValue).filter(Boolean).join(', ')
  return (
    genderRaceAndEthnicity ? <div>{genderRaceAndEthnicity}</div> : null
  )
}

GenderRaceAndEthnicity.propTypes = {
  ethnicity: PropTypes.object,
  gender: PropTypes.string,
  races: PropTypes.array,
}

export default GenderRaceAndEthnicity

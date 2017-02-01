import React from 'react'
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
  ethnicity: React.PropTypes.object,
  gender: React.PropTypes.string,
  races: React.PropTypes.array,
}

export default GenderRaceAndEthnicity

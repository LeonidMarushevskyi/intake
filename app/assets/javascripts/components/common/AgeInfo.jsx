import React from 'react'
import moment from 'moment'

const AgeInfo = ({dateOfBirth}) => {
  const dob = moment.utc(dateOfBirth, 'YYYY-MM-DD')
  const ageInYears = dob.isValid() && moment().diff(dob, 'years')
  return (
    dob.isValid() && <div>{`${ageInYears} yrs old (DOB: ${dob.format('M/D/YYYY')})`}</div>
  )
}

AgeInfo.propTypes = {
  dateOfBirth: React.PropTypes.string,
}

export default AgeInfo

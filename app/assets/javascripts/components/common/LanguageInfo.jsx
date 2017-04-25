import React from 'react'
import PropTypes from 'prop-types'

const LanguageInfo = ({languages}) => {
  const lan = languages && languages.filter(Boolean).join(', ')
  return (lan ? <div><strong className='c-gray half-pad-right'>Language</strong><span>{lan}</span></div> : null)
}

LanguageInfo.propTypes = {
  languages: PropTypes.array,
}

export default LanguageInfo

import PropTypes from 'prop-types'
import React from 'react'

export const MAX_LANGUAGES = 2

export const flagPrimaryLanguage = (languages) => {
  if (languages[0]) languages[0] += ' (Primary)'
  return languages
}

const LanguageInfo = ({languages}) => {
  const lan = languages && flagPrimaryLanguage(languages.filter(Boolean)).join(', ')
  return (lan ? <div><strong className='c-gray half-pad-right'>Language</strong><span>{lan}</span></div> : null)
}

LanguageInfo.propTypes = {
  languages: PropTypes.array,
}

export default LanguageInfo

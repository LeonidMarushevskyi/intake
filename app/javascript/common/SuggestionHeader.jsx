import PropTypes from 'prop-types'
import React from 'react'

const SuggestionHeader = ({currentNumberOfResults, total, searchTerm}) => {
  const oneResult = 1
  const noResults = total < oneResult
  return (
    <div className='react-autosuggest__suggestion'>
      <strong>{noResults ? `No results were found for "${searchTerm}"` :
        `Showing 1-${currentNumberOfResults} of ${total} results for "${searchTerm}"`}</strong>
    </div>
  )
}
SuggestionHeader.propTypes = {
  currentNumberOfResults: PropTypes.number,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}
export default SuggestionHeader

import PropTypes from 'prop-types'
import React from 'react'

const ShowMoreResults = ({onSelect}) => (
  <button
    className='btn btn-default btn-block gap-bottom'
    onClick={onSelect}
  >
    Show more results
  </button>
)
ShowMoreResults.propTypes = {
  onSelect: PropTypes.func,
}
export default ShowMoreResults

import PropTypes from 'prop-types'
import React from 'react'

const ShowMoreResults = ({onClick}) => (
  <button
    className='btn btn-default btn-block gap-bottom'
    onClick={onClick}
  >
    Show more results
  </button>
)
ShowMoreResults.propTypes = {
  onClick: PropTypes.func,
}
export default ShowMoreResults

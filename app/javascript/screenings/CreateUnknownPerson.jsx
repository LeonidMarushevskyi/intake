import PropTypes from 'prop-types'
import React from 'react'

const CreateUnknownPerson = ({onClick}) => (
  <button className='btn btn-default btn-block gap-bottom'
    aria-label='Create a new person'
    onClick={onClick}
  >
    <i className='fa fa-plus' /> Create a new person
  </button>
)

CreateUnknownPerson.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default CreateUnknownPerson

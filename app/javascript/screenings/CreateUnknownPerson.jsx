import PropTypes from 'prop-types'
import React from 'react'

const CreateUnknownPerson = ({onClick}) => (
  <div className='col-md-12'>
    <button className='btn btn-default btn-block gap-bottom'
      aria-label='Create a new person'
      onClick={() => onClick({id: null})}
      data-autosuggest='true'
    >
      <i className='fa fa-plus' /> Create a new person
    </button>
  </div>
)

CreateUnknownPerson.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default CreateUnknownPerson

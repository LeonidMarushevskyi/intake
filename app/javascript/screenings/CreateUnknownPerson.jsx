import PropTypes from 'prop-types'
import React from 'react'

const CreateUnknownPerson = ({saveCallback}) => (
  <div className='col-md-12'>
    <button className='btn btn-default btn-block gap-bottom'
      aria-label='Create a new person'
      onClick={() => saveCallback({id: null})}
      data-autosuggest='true'
    >
      <i className='fa fa-plus' /> Create a new person
    </button>
  </div>
)

CreateUnknownPerson.propTypes = {
  saveCallback: PropTypes.func.isRequired,
}

export default CreateUnknownPerson

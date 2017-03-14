import React from 'react'

const CreateUnknownParticipant = ({saveCallback}) => (
  <div className='col-md-12'>
    <button className='btn btn-default btn-block'
      aria-label='Create a new person'
      onClick={(e) => saveCallback(e, {suggestion: {id: null}})}
      data-autosuggest='true'
    >
      <i className='fa fa-plus' /> Create a new person
    </button>
  </div>
)

CreateUnknownParticipant.propTypes = {
  saveCallback: React.PropTypes.func.isRequired,
}

export default CreateUnknownParticipant

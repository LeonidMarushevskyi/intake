import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'
import CreateUnknownParticipant from 'screenings/CreateUnknownParticipant'

const PersonSearchForm = ({canCreateNewPerson, isSelectable, onSelect}) => (
  <div className='card edit double-gap-top' id='search-card'>
    <div className='card-header'>
      <span>Search</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-12'>
          <label className='pull-left' htmlFor='screening_participants'>Search for clients</label>
          <Autocompleter id='screening_participants'
            onSelect={onSelect}
            isSelectable={isSelectable}
            footer={canCreateNewPerson && <CreateUnknownParticipant saveCallback={onSelect}/>}
          />
        </div>
      </div>
    </div>
  </div>
)

PersonSearchForm.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  isSelectable: PropTypes.func,
  onSelect: PropTypes.func,
}

export default PersonSearchForm

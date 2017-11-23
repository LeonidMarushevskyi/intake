import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'
import CreateUnknownParticipant from 'screenings/CreateUnknownParticipant'
import * as IntakeConfig from 'common/config'

const PersonSearchForm = ({canCreateNewPerson, isSelectable, onSelect}) => (
  <div className='card edit double-gap-top' id='search-card'>
    <div className='card-header'>
      <span>Search</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-12'>
          {
            IntakeConfig.isFeatureActive('release_two') &&
              <label className='pull-left' htmlFor='screening_participants'>Search for clients</label>
          }
          {
            IntakeConfig.isFeatureInactive('release_two') &&
              <label className='pull-left' htmlFor='screening_participants'>Search for any person(Children, parents, collaterals, reporters, alleged perpetrators...)</label>
          }
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

import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'
import AutocompleterFooter from 'common/AutocompleterFooter'
import * as IntakeConfig from 'common/config'

const PersonSearchForm = ({
  canCreateNewPerson,
  isSelectable,
  onChange,
  onClear,
  onLoadMoreResults,
  onSearch,
  onSelect,
  results,
  searchTerm,
  total,
}) => {
  const footer = (
    <AutocompleterFooter
      canCreateNewPerson={canCreateNewPerson}
      canLoadMoreResults={results && total !== results.length}
      onLoadMoreResults={onLoadMoreResults}
      onCreateNewPerson={onSelect}
    />
  )
  return (
    <div>
      <span className='anchor' id='search-card-anchor'/>
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
              <Autocompleter
                id='screening_participants'
                onSelect={onSelect}
                isSelectable={isSelectable}
                footer={footer}
                onClear={onClear}
                onSearch={onSearch}
                onChange={onChange}
                searchTerm={searchTerm}
                total={total}
                results={results}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PersonSearchForm.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  isSelectable: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onLoadMoreResults: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}

export default PersonSearchForm

import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'

export class PersonSearchForm extends React.Component {
  componentWillUnmount() {
    this.props.onClear()
    this.props.onChange('')
  }

  render() {
    const {
      canCreateNewPerson,
      isSelectable,
      onChange,
      onClear,
      onLoadMoreResults,
      onSearch,
      onSelect,
      results,
      searchPrompt,
      searchTerm,
      total,
    } = this.props

    return (
      <div>
        <a className='anchor' id='search-card-anchor'/>
        <div className='card double-gap-bottom' id='search-card'>
          <div className='card-header'>
            <span>Search</span>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-12'>
                <label className='pull-left' htmlFor='screening_participants'>{searchPrompt}</label>
                <Autocompleter
                  id='screening_participants'
                  onSelect={onSelect}
                  isSelectable={isSelectable}
                  onClear={onClear}
                  onSearch={onSearch}
                  onChange={onChange}
                  searchTerm={searchTerm}
                  total={total}
                  results={results}
                  canCreateNewPerson={canCreateNewPerson}
                  onLoadMoreResults={onLoadMoreResults}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
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
  searchPrompt: PropTypes.string,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}

export default PersonSearchForm

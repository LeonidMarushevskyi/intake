import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'
import React from 'react'

const ReleaseOne = ({
  onChange = () => null,
  onClear = () => null,
  onSearch = () => null,
  results = [],
  searchTerm = '',
  total = 0,
}) => (
  <div>
    <label className='no-gap' htmlFor='people'>People</label>
    <Autocompleter
      id='people'
      onSelect={() => null}
      isSelectable={() => false}
      onClear={onClear}
      onSearch={onSearch}
      onChange={onChange}
      searchTerm={searchTerm}
      total={total}
      results={results}
    />
  </div>
)
ReleaseOne.propTypes = {
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSearch: PropTypes.func,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}
export default ReleaseOne

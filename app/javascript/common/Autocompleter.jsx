import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React from 'react'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from 'common/SuggestionHeader'

const Autocompleter = ({
  id,
  isSelectable,
  onChange,
  onClear,
  onSearch,
  onSelect,
  results,
  searchTerm,
  total,
  footer,
}) => {
  const MIN_SEARCHABLE_CHARS = 2
  const onItemSelect = (_value, item) => {
    if (isSelectable(item)) {
      onClear()
      onChange('')
      onSelect(item)
    }
  }
  const renderMenu = (items, searchTerm, _style) => (
    <div>
      <SuggestionHeader
        currentNumberOfResults={items.length}
        total={total}
        searchTerm={searchTerm}
      />
      {items}
      {footer}
    </div>
  )
  const renderItem = (item, _isHighlighted, _styles) => {
    const key = item.legacyDescriptor.legacy_id
    return (
      <div id={`search-result-${key}`} key={key}>
        <PersonSuggestion
          address={item.address}
          dateOfBirth={item.dateOfBirth}
          ethnicity={item.ethnicity}
          firstName={item.firstName}
          gender={item.gender}
          isSealed={item.isSealed}
          isSensitive={item.isSensitive}
          languages={item.languages}
          lastName={item.lastName}
          legacyDescriptor={item.legacyDescriptor}
          middleName={item.middleName}
          nameSuffix={item.nameSuffix}
          phoneNumber={item.phoneNumber}
          races={item.races}
          ssn={item.ssn}
        />
      </div>
    )
  }
  const onChangeInput = (_, value) => {
    const isSearchable = value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
    if (isSearchable) {
      onSearch(value)
    }
    onChange(value)
  }
  return (
    <Autocomplete
      inputProps={{id}}
      value={searchTerm}
      onChange={onChangeInput}
      onSelect={onItemSelect}
      renderMenu={renderMenu}
      renderItem={renderItem}
      getItemValue={(_) => searchTerm}
      items={results}
    />
  )
}

Autocompleter.propTypes = {
  footer: PropTypes.element,
  id: PropTypes.string,
  isSelectable: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}

Autocompleter.defaultProps = {
  footer: null,
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'

export default Autocompleter

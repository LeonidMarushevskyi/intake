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
  const menuStyle = {
    backgroundColor: '#fff',
    border: '1px solid #d4d4d4',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    fontFamily: 'Helvetica, sans-serif',
    fontSize: '16px',
    fontWeight: 300,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    display: 'block',
  }
  const resultStyle = {
    borderBottom: '2px solid #d4d4d4',
    cursor: 'pointer',
    padding: '10px 20px',
  }
  const MIN_SEARCHABLE_CHARS = 2
  const onItemSelect = (_value, item) => {
    if (isSelectable(item)) {
      onClear()
      onChange('')
      onSelect(item)
    }
  }
  const renderMenu = (items, searchTerm, _style) => (
    <div style={menuStyle}>
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
      <div id={`search-result-${key}`} key={key} style={resultStyle}>
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
      getItemValue={(_) => searchTerm}
      inputProps={{id}}
      items={results}
      onChange={onChangeInput}
      onSelect={onItemSelect}
      renderItem={renderItem}
      renderMenu={renderMenu}
      value={searchTerm}
      wrapperStyle={{display: 'block', position: 'relative'}}
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

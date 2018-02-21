import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from 'common/SuggestionHeader'
import AutocompleterFooter from 'common/AutocompleterFooter'

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
const resultStyleHighlighted = {
  ...resultStyle,
  backgroundColor: '#d4d4d4',
}
const MIN_SEARCHABLE_CHARS = 2

export class Autocompleter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: false,
    }
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
  }

  isSearchable(value) {
    return value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  onItemSelect(_value, item) {
    const {isSelectable, onClear, onChange, onSelect} = this.props
    if (isSelectable(item)) {
      onClear()
      onChange('')
      onSelect(item)
      this.setState({menuVisible: false})
    } else {
      alert('You are not authorized to add this person.') // eslint-disable-line no-alert
    }
  }

  onFocus() {
    if (this.isSearchable(this.props.searchTerm)) {
      this.setState({menuVisible: true})
    } else {
      this.setState({menuVisible: false})
    }
  }

  onBlur() {
    this.setState({menuVisible: false})
  }

  renderMenu(items, searchTerm, _style) {
    const {canCreateNewPerson, onLoadMoreResults, onSelect, total} = this.props
    return (
      <div style={menuStyle}>
        <SuggestionHeader
          currentNumberOfResults={items.length}
          total={total}
          searchTerm={searchTerm}
        />
        {items}
        <AutocompleterFooter
          canCreateNewPerson={canCreateNewPerson}
          canLoadMoreResults={items && total !== items.length}
          onLoadMoreResults={onLoadMoreResults}
          onCreateNewPerson={() => {
            onSelect({id: null})
            this.setState({menuVisible: false})
            // This is required because react-autcompleter onMouseLeave event is never fired.
            // So the autocompleter maintains focus and ignore blur events.
            // We are manually forcing a blur event here so we can get out.
            this.element_ref._ignoreBlur = false
          }}
        />
      </div>
    )
  }

  renderItem(item, isHighlighted, _styles) {
    const key = item.legacyDescriptor.legacy_id
    return (
      <div
        id={`search-result-${key}`}
        key={key}
        style={isHighlighted ? resultStyleHighlighted : resultStyle}
      >
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

  onChangeInput(_, value) {
    const {onSearch, onChange} = this.props
    if (this.isSearchable(value)) {
      onSearch(value)
      this.setState({menuVisible: true})
    } else {
      this.setState({menuVisible: false})
    }
    onChange(value)
  }

  render() {
    const {searchTerm, id, results} = this.props
    const {menuVisible} = this.state
    return (
      <Autocomplete
        ref={(el) => (this.element_ref = el)}
        getItemValue={(_) => searchTerm}
        inputProps={{id, onBlur: this.onBlur, onFocus: this.onFocus}}
        items={results}
        onChange={this.onChangeInput}
        onSelect={this.onItemSelect}
        renderItem={this.renderItem}
        open={menuVisible}
        renderMenu={this.renderMenu}
        value={searchTerm}
        wrapperStyle={{display: 'block', position: 'relative'}}
      />
    )
  }
}

Autocompleter.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  id: PropTypes.string,
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

Autocompleter.defaultProps = {
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'

export default Autocompleter

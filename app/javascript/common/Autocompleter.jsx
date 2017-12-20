import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import SuggestionHeader from 'common/SuggestionHeader'
const MIN_SEARCHABLE_CHARS = 2

export default class Autocompleter extends React.Component {
  constructor(props) {
    super(props)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this)
  }

  onSuggestionSelected(event, {suggestion}) {
    const {
      isSelectable,
      onClear,
      onSelect,
      onChange,
    } = this.props
    if (isSelectable(suggestion)) {
      onClear()
      onChange('')
      onSelect(suggestion)
    }
  }

  renderSuggestion(suggestion) {
    if (suggestion.emptyResult) {
      return false
    } else {
      return (<PersonSuggestion {...suggestion} />)
    }
  }

  renderSuggestionsContainer({children, ...props}) {
    const {total, searchTerm, results, footers} = this.props
    let newChildren = null
    if (children) {
      const items = children.props.items.filter((item) => !item.emptyResult)
      newChildren = React.cloneElement(children, {items})
    }
    return (
      <div {...props}>
        <SuggestionHeader
          currentNumberOfResults={results.length}
          total={total}
          searchTerm={searchTerm}
        />
        {newChildren}
        {footers}
      </div>
    )
  }

  render() {
    const {
      id,
      onChange,
      onClear,
      onSearch,
      searchTerm,
      results,
    } = this.props
    const inputProps = {
      id,
      value: searchTerm,
      onChange: (event, {newValue}) => onChange(newValue),
    }
    return (
      <ReactAutosuggest
        suggestions={[...results, {emptyResult: true}]}
        shouldRenderSuggestions={(value) => (value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS)}
        onSuggestionsFetchRequested={({value}) => onSearch(value)}
        onSuggestionsClearRequested={onClear}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={() => searchTerm}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
      />
    )
  }
}

Autocompleter.propTypes = {
  footers: PropTypes.arrayOf(PropTypes.element),
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
  footers: [],
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'

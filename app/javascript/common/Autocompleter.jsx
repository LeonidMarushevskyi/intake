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
      if (!suggestion.props) {
        // Assume footer components handle their own clicks.
        onSelect(suggestion)
      }
    }
  }

  getSuggestionValue(suggestion) {
    return `${suggestion.firstName} ${suggestion.lastName}`
  }

  shouldRenderSuggestions(value) {
    return value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  renderSuggestion(suggestion) {
    if (suggestion.props && suggestion.type) {
      // It's a component and we let React render it
      return suggestion
    } else {
      // It's a real result
      return (<PersonSuggestion {...suggestion} />)
    }
  }

  renderSuggestionsContainer({children, ...props}) {
    const {total, searchTerm} = this.props
    return (
      <div {...props}>
        <SuggestionHeader
          currentNumberOfResults={total}
          total={total}
          searchTerm={searchTerm}
        />
        {children}
      </div>
    )
  }

  render() {
    const {
      footer,
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
        suggestions={footer ? [...results, footer] : results}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionsFetchRequested={({value}) => onSearch(value)}
        onSuggestionsClearRequested={onClear}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
      />
    )
  }
}

Autocompleter.propTypes = {
  footer: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.bool,
  ]),
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
  footer: false,
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'

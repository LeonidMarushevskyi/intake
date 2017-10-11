import * as Utils from 'utils/http'
import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import _ from 'lodash'
const MIN_SEARCHABLE_CHARS = 2

export default class Autocompleter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
      isAutocompleterFocused: false,
    }

    const debounceDelay = 100
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this)
    this.onChange = this.onChange.bind(this)
    this.loadSuggestions = this.loadSuggestions.bind(this)
    this.debouncedLoadSuggestions = _.debounce(this.loadSuggestions, debounceDelay)
  }

  loadSuggestions(value) {
    this.setState({isLoading: true})
    Utils.request('GET', '/api/v1/people/search', {search_term: value})
      .then((result) =>
        this.setState({
          isLoading: false,
          suggestions: result,
        })
      )
  }

  onChange(event, {newValue}) {
    this.setState({value: newValue})
  }

  onSuggestionsFetchRequested({value}) {
    this.debouncedLoadSuggestions(value)
  }

  onSuggestionSelected(event, {suggestion}) {
    if (this.props.isSelectable(suggestion)) {
      this.onSuggestionsClearRequested()
      this.setState({value: ''})
      if (!suggestion.props) {
        // Assume footer components handle their own clicks.
        this.props.onSelect(suggestion)
      }
    }
  }

  onSuggestionsClearRequested() {
    this.setState({suggestions: []})
  }

  getSuggestionValue(suggestion) {
    return `${suggestion.first_name} ${suggestion.last_name}`
  }

  shouldRenderSuggestions(value) {
    return value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  mapPersonSearchAttributes(suggestion) {
    const {
      middle_name, name_suffix, legacy_descriptor,
      gender, languages, races, ethnicity,
      addresses, phone_numbers, highlight,
      sensitive, sealed,
    } = suggestion
    const first = 0
    const address = addresses[first] || null
    const phoneNumber = phone_numbers[first] || null
    var highlightedText = (fieldName, suggestion, highlight) => {
      if (highlight && highlight[fieldName]) {
        return highlight[fieldName]
      } else {
        return suggestion[fieldName]
      }
    }
    var maskSSN = (suggestion) => {
      const ssn = suggestion.ssn
      const maxLength = 4
      if (ssn && ssn.length > maxLength) {
        return {ssn: `${ssn.substring(ssn.length - maxLength, ssn.length)}`}
      } else {
        return suggestion
      }
    }
    return {
      firstName: highlightedText('first_name', suggestion, highlight),
      lastName: highlightedText('last_name', suggestion, highlight),
      middleName: middle_name,
      nameSuffix: name_suffix,
      legacyDescriptor: legacy_descriptor,
      gender: gender,
      languages: languages,
      races: races,
      ethnicity: ethnicity,
      dateOfBirth: highlightedText('date_of_birth', suggestion, highlight),
      ssn: highlightedText('ssn', maskSSN(suggestion), highlight),
      address: address && {
        city: address.city,
        state: address.state,
        streetAddress: address.street_address,
        type: address.type,
        zip: address.zip,
      },
      phoneNumber: phoneNumber && {
        number: phoneNumber.number,
        type: phoneNumber.type,
      },
      isSensitive: sensitive,
      isSealed: sealed,
    }
  }

  renderSuggestion(suggestion) {
    if (suggestion.props && suggestion.type) {
      // It's a component and we let React render it
      return suggestion
    } else {
      // It's a real result
      return (
        <PersonSuggestion
          {...this.mapPersonSearchAttributes(suggestion)}
        />
      )
    }
  }

  renderSuggestionsContainer(properties) {
    const children = properties.children
    return (
      <div {...properties}>
        {children}
      </div>
    )
  }

  /*eslint no-magic-numbers: ["error", { "ignore": [1] }]*/
  render() {
    const {value, suggestions} = this.state
    if (this.props.footer && suggestions[suggestions.length - 1] !== this.props.footer) {
      suggestions.push(this.props.footer)
    }
    const inputProps = {
      id: this.props.id,
      value,
      onChange: this.onChange,
    }
    return (
      <ReactAutosuggest
        suggestions={suggestions}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
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
  onSelect: PropTypes.func,
}

Autocompleter.defaultProps = {
  footer: false,
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'

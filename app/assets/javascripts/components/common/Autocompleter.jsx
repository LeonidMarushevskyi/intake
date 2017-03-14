import * as Utils from 'utils/http'
import CreateUnknownParticipant from 'components/screenings/CreateUnknownParticipant'
import PersonSuggestion from 'components/common/PersonSuggestion'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
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
    this.loadSuggestions(value)
  }

  onSuggestionSelected(event, {suggestion}) {
    this.onSuggestionsClearRequested()
    this.setState({value: ''})
    this.props.onSelect(suggestion)
  }

  onSuggestionsClearRequested() {
    this.setState({suggestions: []})
  }

  getSuggestionValue(suggestion) {
    return `${suggestion.first_name} ${suggestion.last_name}`
  }

  shouldRenderSuggestions(value) {
    return value.trimLeft().length >= MIN_SEARCHABLE_CHARS
  }

  renderSuggestion(suggestion) {
    const {first_name, last_name, middle_name, name_suffix, gender, languages, races, ethnicity, date_of_birth, ssn, addresses, phone_numbers} = suggestion
    const first = 0
    const address = addresses[first] || null
    const addressInfo = address && {
      city: address.city,
      state: address.state,
      streetAddress: address.street_address,
      type: address.type,
      zip: address.zip,
    }
    const phoneNumber = phone_numbers[first] || null
    const phoneNumberInfo = phoneNumber && {
      number: phoneNumber.number,
      type: phoneNumber.type,
    }
    return (
      <PersonSuggestion
        firstName={first_name}
        lastName={last_name}
        middleName={middle_name}
        nameSuffix={name_suffix}
        gender={gender}
        languages={languages}
        races={races}
        ethnicity={ethnicity}
        dateOfBirth={date_of_birth}
        ssn={ssn}
        address={addressInfo}
        phoneNumber={phoneNumberInfo}
      />
    )
  }

  showWithoutSuggestions(state) {
    const minimumCharsForSearch = 2
    const ltrimString = '/^\s+/,""'
    return state.value.replace(ltrimString).length >= minimumCharsForSearch && (state.isAutocompleterFocused)
  }

  renderSuggestionsContainer(properties) {
    const children = properties.children
    if (this.showWithoutSuggestions(this.state)) {
      properties.className += ' force-open'
    }
    return (
      <div {...properties}>
        {children}
        {
          this.props.enableFooter &&
          <CreateUnknownParticipant saveCallback={this.onSuggestionSelected.bind(this)} />
        }
      </div>
    )
  }

  onAutocompleterFocus() {
    this.setState({isAutocompleterFocused: true})
  }

  onAutocompleterBlur(e) {
    if (!(e.relatedTarget && e.relatedTarget.attributes['data-autosuggest'])) {
      this.setState({isAutocompleterFocused: false})
    }
  }

  render() {
    const {value, suggestions} = this.state
    const inputProps = {
      id: this.props.id,
      value,
      onChange: this.onChange.bind(this),
      'aria-expanded': true,
    }
    return (
      <div
        onFocus={this.onAutocompleterFocus.bind(this)}
        onBlur={this.onAutocompleterBlur.bind(this)}
      >
      <ReactAutosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestionSelected.bind(this)}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion.bind(this)}
        inputProps={inputProps}
        renderSuggestionsContainer={this.renderSuggestionsContainer.bind(this)}
      />
    </div>
    )
  }
}

Autocompleter.propTypes = {
  enableFooter: React.PropTypes.bool,
  id: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  shouldForceOpen: React.PropTypes.func,
}
Autocompleter.displayName = 'Autocompleter'

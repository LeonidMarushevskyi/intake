import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import $ from 'jquery'
import AutocompleterInvolvedPeopleList from 'AutocompleterInvolvedPeopleList'

export default class Autocompleter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: [],
      involvedPeople: this.props.involvedPeople || [],
      isLoading: false,
    }
  }

  loadSuggestions(value) {
    this.setState({
      isLoading: true,
    })

    var self = this
    $.get('/people/search', {query: value})
      .done((result) => {
        self.setState({
          isLoading: false,
          suggestions: result,
        })
      })
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested({value}) {
    this.loadSuggestions(value)
  }

  onSuggestionSelected(event, {suggestion}) {
    var involvedPeople = this.state.involvedPeople.slice(0)
    involvedPeople.push(suggestion)
    this.onSuggestionsClearRequested()
    this.setState({
      value: '',
      involvedPeople: involvedPeople,
    })
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    })
  }

  getSuggestionValue(suggestion) {
    return `${suggestion.first_name} ${suggestion.last_name}`
  }

  renderSuggestion(suggestion) {
    return (
      <span>{`${suggestion.first_name} ${suggestion.last_name}`}</span>
    )
  }

  renderSuggestionsContainer() {
    const properties = arguments[0]
    const children = properties.children
    return (
      <div {...properties}>
        {children}
      </div>
    )
  }

  render() {
    const {value, suggestions, involvedPeople} = this.state
    const inputProps = {
      placeholder: 'Search people...',
      id: 'referral_involved_people',
      value,
      onChange: this.onChange.bind(this),
    }

    return (
      <div>
        <ReactAutosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
          onSuggestionSelected={this.onSuggestionSelected.bind(this)}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
        />
        <AutocompleterInvolvedPeopleList involvedPeople={involvedPeople} />
      </div>
    )
  }
}

Autocompleter.propTypes = {
  involvedPeople: React.PropTypes.array,
}

Autocompleter.defaultProps = {
  involvedPeople: [],
}

import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import $ from 'jquery'
import AutocompleterParticipantsList from 'AutocompleterParticipantsList'

export default class Autocompleter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: [],
      participants: this.props.participants || [],
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
    var participants = this.state.participants.slice(0)
    participants.push(suggestion)
    this.onSuggestionsClearRequested()
    this.setState({
      value: '',
      participants: participants,
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
    const {value, suggestions, participants} = this.state
    const inputProps = {
      placeholder: 'Search people...',
      id: this.props.id,
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
        <AutocompleterParticipantsList participants={participants} />
      </div>
    )
  }
}

Autocompleter.propTypes = {
  id: React.PropTypes.string,
  participants: React.PropTypes.array,
}

Autocompleter.defaultProps = {
  participants: [],
}

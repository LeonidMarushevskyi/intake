import $ from 'jquery'
import AutocompleterParticipantsList from 'AutocompleterParticipantsList'
import Immutable from 'immutable'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'

export default class Autocompleter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: [],
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
    const {participants} = this.props
    this.onSuggestionsClearRequested()
    this.setState({
      value: '',
    })
    const newParticipants = Immutable.fromJS(participants)
      .push(Immutable.Map(suggestion))
    this.props.setField(['participants'], newParticipants)
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
    const {value, suggestions} = this.state
    const {participants} = this.props
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
  setField: React.PropTypes.func,
}

Autocompleter.defaultProps = {
  participants: [],
}

import $ from 'jquery'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import moment from 'moment'
import Gender from 'Gender'

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
    this.onSuggestionsClearRequested()
    this.setState({
      value: '',
    })
    this.props.onSelect(suggestion)
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
    const {first_name, last_name, date_of_birth, gender} = suggestion
    let ageInfo
    const dob = moment(date_of_birth, 'YYYY-MM-DD')
    if (dob.isValid()) {
      const ageInYears = moment().diff(dob, 'years')
      ageInfo = `${ageInYears} yrs old (${dob.format('M/D/YYYY')})`
    }
    return (
      <div>
        <div>{`${first_name} ${last_name}`}</div>
        <div>{Gender[gender]}</div>
        <div>{ageInfo}</div>
      </div>
    )
  }

  renderSuggestionsContainer(properties) {
    const children = properties.children
    return (
      <div {...properties}>
        {children}
      </div>
    )
  }

  render() {
    const {value, suggestions} = this.state
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
      </div>
    )
  }
}

Autocompleter.propTypes = {
  id: React.PropTypes.string,
  onSelect: React.PropTypes.func,
}
Autocompleter.displayName = 'Autocompleter'

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

  renderSSN(ssn) {
    return (
      ssn ? <div><strong className='c-gray half-pad-right'>SSN</strong><span>{ssn}</span></div> : null
    )
  }

  renderAddress(address) {
    let addressIcon
    let addressInfo
    let addressType

    if (address) {
      const {type, street_address, city, state, zip} = address
      const state_zip = [state, zip].filter(Boolean).join(' ')
      addressIcon = <i className='fa fa-map-marker c-gray half-pad-right' />
      addressType = type ? <strong className='c-gray half-pad-right'>{type}</strong> : null
      addressInfo = <span>{[street_address, city, state_zip].filter(Boolean).join(', ')}</span>
    }
    return <div>{addressIcon}{addressType}{addressInfo}</div>
  }

  renderSuggestion(suggestion) {
    const {first_name, last_name, date_of_birth, gender, ssn, address} = suggestion
    let ageInfo
    const dob = moment(date_of_birth, 'YYYY-MM-DD')
    if (dob.isValid()) {
      const ageInYears = moment().diff(dob, 'years')
      ageInfo = `${ageInYears} yrs old (${dob.format('M/D/YYYY')})`
    }
    return (
      <div className='row'>
        <div className='col-md-2'>
          <img src='/assets/default-profile.svg' />
        </div>
        <div className='col-md-4'>
          <strong>{[first_name, last_name].filter(Boolean).join(' ')}</strong>
          <div>{Gender[gender]}</div>
          <div>{ageInfo}</div>
          {this.renderSSN(ssn)}
        </div>
        <div className='col-md-6'>
          {this.renderAddress(address)}
        </div>
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
          renderSuggestion={this.renderSuggestion.bind(this)}
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

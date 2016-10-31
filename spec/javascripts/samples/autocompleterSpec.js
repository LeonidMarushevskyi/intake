import $ from 'jquery'
import Autocompleter from 'Autocompleter'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import matchers from 'jasmine-immutable-matchers'
import {shallow} from 'enzyme'

describe('<Autcompleter />', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers)
  })

  it('renders a Autosuggest component', () => {
    const wrapper = shallow(<Autocompleter />)
    expect(wrapper.find(ReactAutosuggest).length).toBe(1)
  })

  describe('#onChange', () => {
    it('updates the value of the "value" state', () => {
      const wrapper = shallow(<Autocompleter />)
      expect(wrapper.state('value')).toBe('')
      wrapper.instance().onChange('some_event', {newValue: 'foobar', method: 'baz'})
      expect(wrapper.state('value')).toBe('foobar')
    })
  })

  describe('#onSuggestionsFetchRequested', () => {
    it('uses the people search api to get the result for the search term', () => {
      const bart_simpson = {first_name: 'Bart', last_name: 'Simpson'}
      const promise = $.Deferred()
      promise.resolve([bart_simpson])
      spyOn($, 'get').and.returnValue(promise)
      const wrapper = shallow(<Autocompleter />)
      wrapper.instance().onSuggestionsFetchRequested({value: 'Simpson'})
      expect(wrapper.state('suggestions')).toEqual([bart_simpson])
    })
  })

  describe('#onSuggestionSelected', () => {
    it('clears the search Text and adds the suggestion', () => {
      const onSelect = jasmine.createSpy('onSelectSpy')
      const wrapper = shallow(<Autocompleter onSelect={onSelect} />)
      const suggestion = {id: 1, first_name: 'Bart'}
      wrapper.instance().onSuggestionSelected('selected', {suggestion: suggestion})
      expect(onSelect.calls.argsFor(0)[0]).toEqual(suggestion)
      expect(wrapper.state('value')).toEqual('')
    })
  })

  describe('#onSuggestionsClearRequested', () => {
    it('clears the suggestions', () => {
      const wrapper = shallow(<Autocompleter />)
      wrapper.setState({suggestions: ['foo', 'bar']})
      expect(wrapper.state('suggestions')).toEqual(['foo', 'bar'])
      wrapper.instance().onSuggestionsClearRequested()
      expect(wrapper.state('suggestions')).toEqual([])
    })
  })

  describe('#getSuggestionValue', () => {
    it('return the suggestion to display on the input field', () => {
      const wrapper = shallow(<Autocompleter />)
      const suggestion = {first_name: 'Bart', last_name: 'Simpson'}
      const value = wrapper.instance().getSuggestionValue(suggestion)
      expect(value).toBe('Bart Simpson')
    })
  })

  describe('#renderSuggestion', () => {
    it('renders the first name and last name', () => {
      const wrapper = shallow(<Autocompleter />)
      const suggestion = {first_name: 'Bart', last_name: 'Simpson'}
      const value = wrapper.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).toContain('<div>Bart Simpson</div>')
    })

    it('renders the participants date of birth', () => {
      const wrapper = shallow(<Autocompleter />)
      const suggestion = {date_of_birth: '1990-02-13'}
      const value = wrapper.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).toContain('<div>(2/13/1990)</div>')
    })
  })

  describe('#renderSuggestionsContainer', () => {
    it('rendres the suggestions container', () => {
      const wrapper = shallow(<Autocompleter />)
      const container = wrapper.instance().renderSuggestionsContainer({children: 'foobar', className: 'baz'})
      expect(shallow(container).html()).toBe('<div class="baz">foobar</div>')
    })
  })
})

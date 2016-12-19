import * as Utils from 'utils/http'
import Autocompleter from 'components/common/Autocompleter'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import matchers from 'jasmine-immutable-matchers'
import {shallow, mount} from 'enzyme'

describe('<Autcompleter />', () => {
  function stubSuggestions(suggestions) {
    const promise = jasmine.createSpyObj('promise', ['then'])
    promise.then.and.callFake((thenFunc) => thenFunc(suggestions))
    spyOn(Utils, 'request')
    Utils.request.and.returnValue(promise)
  }

  beforeEach(() => {
    jasmine.addMatchers(matchers)
  })

  it('renders a Autosuggest component', () => {
    const component = shallow(<Autocompleter />)
    expect(component.find(ReactAutosuggest).length).toBe(1)
  })

  describe('#onChange', () => {
    it('updates the value of the "value" state', () => {
      const component = shallow(<Autocompleter />)
      expect(component.state('value')).toBe('')
      component.instance().onChange('some_event', {newValue: 'foobar', method: 'baz'})
      expect(component.state('value')).toBe('foobar')
    })
  })

  describe('#onSuggestionsFetchRequested', () => {
    it('uses the people search api to get the result for the search term', () => {
      const bart_simpson = {first_name: 'Bart', last_name: 'Simpson'}
      stubSuggestions([bart_simpson])
      const component = shallow(<Autocompleter />)
      component.instance().onSuggestionsFetchRequested({value: 'Simpson'})
      expect(component.state('suggestions')).toEqual([bart_simpson])
    })
  })

  describe('#onSuggestionSelected', () => {
    it('clears the search Text and adds the suggestion', () => {
      const onSelect = jasmine.createSpy('onSelectSpy')
      const component = shallow(<Autocompleter onSelect={onSelect} />)
      const suggestion = {id: 1, first_name: 'Bart'}
      component.instance().onSuggestionSelected('selected', {suggestion: suggestion})
      expect(onSelect.calls.argsFor(0)[0]).toEqual(suggestion)
      expect(component.state('value')).toEqual('')
    })
  })

  describe('#onSuggestionsClearRequested', () => {
    it('clears the suggestions', () => {
      const component = shallow(<Autocompleter />)
      component.setState({suggestions: ['foo', 'bar']})
      expect(component.state('suggestions')).toEqual(['foo', 'bar'])
      component.instance().onSuggestionsClearRequested()
      expect(component.state('suggestions')).toEqual([])
    })
  })

  describe('#getSuggestionValue', () => {
    it('return the suggestion to display on the input field', () => {
      const component = shallow(<Autocompleter />)
      const suggestion = {first_name: 'Bart', last_name: 'Simpson'}
      const value = component.instance().getSuggestionValue(suggestion)
      expect(value).toBe('Bart Simpson')
    })
  })

  describe('#renderSuggestion', () => {
    let component
    beforeEach(() => {
      component = mount(<Autocompleter />)
      const result = [{
        first_name: 'Bart',
        last_name: 'Simpson',
        gender: 'female',
        date_of_birth: '1990-02-13',
        ssn: '123-45-6789',
        address: {
          id: 1,
          street_address: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: 11344,
          type: 'School',
        },
      }]
      stubSuggestions(result)
    })

    it('renders the PersonSuggestion view', () => {
      component.find('input').simulate('focus')
      component.find('input').simulate('change', {target: {value: 'Bart Simpson'}})
      expect(component.find('PersonSuggestion').props()).toEqual({
        firstName: 'Bart',
        lastName: 'Simpson',
        gender: 'female',
        dateOfBirth: '1990-02-13',
        ssn: '123-45-6789',
        address: {
          streetAddress: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: 11344,
          type: 'School',
        },
      })
    })
  })

  describe('#renderSuggestionsContainer', () => {
    it('renders the suggestions container', () => {
      const component = shallow(<Autocompleter />)
      const container = component.instance().renderSuggestionsContainer({children: 'foobar', className: 'baz'})
      expect(shallow(container).html()).toBe('<div class="baz">foobar</div>')
    })
  })
})

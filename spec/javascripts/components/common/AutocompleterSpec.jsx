import * as Utils from 'utils/http'
import Autocompleter from 'components/common/Autocompleter'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import matchers from 'jasmine-immutable-matchers'
import {shallow, mount} from 'enzyme'

describe('<Autocompleter />', () => {
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
      const suggestion = {id: '1', first_name: 'Bart'}
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

  describe('with footer', () => {
    beforeEach(() => {
      stubSuggestions([])
    })

    const component = mount(<Autocompleter enableFooter={true} />)
    describe('is closed', () => {
      it('has aria-expanded of false', () => {
        expect(component.find('input').props()['aria-expanded']).toBe(false)
      })
      it('does not have the force-open class', () => {
        expect(component.find('.force-open').length).toBe(0)
      })
      it('its state is closed', () => {
        expect(component.state('isAutocompleterFocused')).toBe(false)
      })
    })
    describe('is open', () => {
      beforeEach(() => {
        component.find('input').simulate('focus')
        component.find('input').simulate('change', {target: {value: 'Bart Simpson'}})
      })
      it('has aria-expanded of false', () => {
        expect(component.find('input').props()['aria-expanded']).toBe(true)
      })
      it('does not have the force-open class', () => {
        expect(component.find('.force-open').length).toBe(1)
      })
      it('its state is closed', () => {
        expect(component.state('isAutocompleterFocused')).toBe(true)
      })
    })
  })

  describe('#shouldRenderSuggestions', () => {
    it('returns true when search value contains two non whitespace characters', () => {
      const instance = shallow(<Autocompleter />).instance()
      expect(instance.shouldRenderSuggestions('aa')).toEqual(true)
    })

    it('returns true when search value contains a character then a whitespace', () => {
      const instance = shallow(<Autocompleter />).instance()
      expect(instance.shouldRenderSuggestions('a ')).toEqual(true)
    })

    it('returns false when search value contains two whitespace characters', () => {
      const instance = shallow(<Autocompleter />).instance()
      expect(instance.shouldRenderSuggestions('  ')).toEqual(false)
    })

    it('returns false when search value contains a whitespace then a character', () => {
      const instance = shallow(<Autocompleter />).instance()
      expect(instance.shouldRenderSuggestions(' a')).toEqual(false)
    })
  })

  describe('mapPersonSearchAttributes', () => {
    let component
    beforeEach(() => {
      component = shallow(<Autocompleter />)
    })

    it('maps person search attributes to suggestion attributes', () => {
      const suggestion = {
        first_name: 'Bart',
        last_name: 'Simpson',
        middle_name: 'Jacqueline',
        name_suffix: 'md',
        gender: 'female',
        languages: ['French', 'Italian'],
        races: [
          {race: 'White', race_detail: 'European'},
          {race: 'American Indian or Alaska Native'},
        ],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Central American',
        },
        date_of_birth: '1990-02-13',
        ssn: '123-45-6789',
        addresses: [{
          id: '1',
          street_address: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: '11344',
          type: 'School',
        }],
        phone_numbers: [{
          id: '2',
          number: '994-907-6774',
          type: 'Home',
        }],
      }
      const attributes = component.instance().mapPersonSearchAttributes(suggestion)
      expect(attributes.firstName).toEqual('Bart')
      expect(attributes.lastName).toEqual('Simpson')
      expect(attributes.middleName).toEqual('Jacqueline')
      expect(attributes.nameSuffix).toEqual('md')
      expect(attributes.gender).toEqual('female')
      expect(attributes.languages).toEqual(['French', 'Italian'])
      expect(attributes.races).toEqual([
        {race: 'White', race_detail: 'European'},
        {race: 'American Indian or Alaska Native'},
      ])
      expect(attributes.ethnicity).toEqual({
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: 'Central American',
      })
      expect(attributes.dateOfBirth).toEqual('1990-02-13')
      expect(attributes.ssn).toEqual('123-45-6789')
      expect(attributes.address).toEqual({
        streetAddress: '234 Fake Street',
        city: 'Flushing',
        state: 'NM',
        zip: '11344',
        type: 'School',
      })
      expect(attributes.phoneNumber).toEqual({
        number: '994-907-6774',
        type: 'Home',
      })
    })

    it('maps the first address and phone number result to addressi and phone number', () => {
      const suggestion = {
        addresses: [{
          id: '1',
          street_address: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: '11344',
          type: 'School',
        }, {
          id: '2',
          street_address: '2 Camden Crt',
          city: 'Flushing',
          state: 'NM',
          zip: '11222',
          type: 'Home',
        }],
        phone_numbers: [{
          number: '994-907-6774',
          type: 'Home',
        }, {
          number: '111-222-6774',
          type: 'Work',
        }],
      }
      const attributes = component.instance().mapPersonSearchAttributes(suggestion)
      expect(attributes.address).toEqual({
        streetAddress: '234 Fake Street',
        city: 'Flushing',
        state: 'NM',
        zip: '11344',
        type: 'School',
      })
    })

    it('maps person search attributes when phone numbers and addresses are empty', () => {
      const suggestion = {phone_numbers: [], addresses: []}
      const attributes = component.instance().mapPersonSearchAttributes(suggestion)
      expect(attributes.address).toEqual(null)
      expect(attributes.phoneNumber).toEqual(null)
    })

    it('maps person search hightlight fields', () => {
      const suggestion = {
        first_name: 'Bart',
        last_name: 'Simpson',
        date_of_birth: '1990-02-13',
        ssn: '123-45-6789',
        addresses: [],
        phone_numbers: [],
        highlight: {
          first_name: '<em>Bar</em>t',
          last_name: 'Sim<em>pson</em>',
          ssn: '<em>123-45-</em>6789',
          date_of_birth: '<em>1990</em>-02-13',
        },
      }
      const attributes = component.instance().mapPersonSearchAttributes(suggestion)
      expect(attributes.firstName).toEqual('<em>Bar</em>t')
      expect(attributes.lastName).toEqual('Sim<em>pson</em>')
      expect(attributes.ssn).toEqual('<em>123-45-</em>6789')
      expect(attributes.dateOfBirth).toEqual('<em>1990</em>-02-13')
    })
  })

  describe('#renderSuggestion', () => {
    let component
    it('renders the PersonSuggestion view', () => {
      component = mount(<Autocompleter />)
      const result = [{
        first_name: 'Bart',
        last_name: 'Simpson',
        middle_name: 'Jacqueline',
        name_suffix: 'md',
        gender: 'female',
        languages: ['French', 'Italian'],
        races: [
          {race: 'White', race_detail: 'European'},
          {race: 'American Indian or Alaska Native'},
        ],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Central American',
        },
        date_of_birth: '1990-02-13',
        ssn: '123-45-6789',
        addresses: [{
          id: '1',
          street_address: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: '11344',
          type: 'School',
        }],
        phone_numbers: [{
          id: '2',
          number: '994-907-6774',
          type: 'Home',
        }],
      }]
      stubSuggestions(result)

      component.find('input').simulate('focus')
      component.find('input').simulate('change', {target: {value: 'Bart Simpson'}})
      expect(component.find('PersonSuggestion').props()).toEqual({
        firstName: 'Bart',
        lastName: 'Simpson',
        middleName: 'Jacqueline',
        nameSuffix: 'md',
        gender: 'female',
        languages: ['French', 'Italian'],
        races: [
          {race: 'White', race_detail: 'European'},
          {race: 'American Indian or Alaska Native'},
        ],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Central American',
        },
        dateOfBirth: '1990-02-13',
        ssn: '123-45-6789',
        address: {
          streetAddress: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: '11344',
          type: 'School',
        },
        phoneNumber: {
          number: '994-907-6774',
          type: 'Home',
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

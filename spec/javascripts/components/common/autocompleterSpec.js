import $ from 'jquery'
import Autocompleter from 'components/common/Autocompleter'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import matchers from 'jasmine-immutable-matchers'
import moment from 'moment'
import {shallow} from 'enzyme'

describe('<Autcompleter />', () => {
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
      const promise = $.Deferred()
      promise.resolve([bart_simpson])
      spyOn($, 'get').and.returnValue(promise)
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
    it('renders the first name and last name', () => {
      const component = shallow(<Autocompleter />)
      const suggestion = {first_name: 'Bart', last_name: 'Simpson'}
      const value = component.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).toContain('<strong>Bart Simpson</strong>')
    })

    it('renders the gender', () => {
      const component = shallow(<Autocompleter />)
      const suggestion = {gender: 'female'}
      const value = component.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).toContain('<div>Female</div>')
    })

    it('renders the date of birth in format D/M/YYYY', () => {
      const component = shallow(<Autocompleter />)
      const suggestion = {date_of_birth: '1990-02-13'}
      const value = component.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).toContain('(2/13/1990)')
    })

    it('renders the age', () => {
      const component = shallow(<Autocompleter />)
      const date_of_birth = moment().subtract(15, 'years').format('YYYY-MM-DD')
      const suggestion = {date_of_birth: date_of_birth}
      const value = component.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).toContain('15 yrs old')
    })

    it('does not render age when date of birth is not present', () => {
      const component = shallow(<Autocompleter />)
      const suggestion = {date_of_birth: null}
      const value = component.instance().renderSuggestion(suggestion)
      expect(shallow(value).html()).not.toContain('yrs old')
    })

    describe('SSN', () => {
      it('gets rendered when present', () => {
        const component = shallow(<Autocompleter />)
        const suggestion = {ssn: '123-456-7890'}
        const value = component.instance().renderSuggestion(suggestion)
        expect(shallow(value).html()).toContain('<div><strong class="c-gray half-pad-right">SSN</strong><span>123-456-7890</span></div>')
      })

      it('does not get rendered when NOT present', () => {
        const component = shallow(<Autocompleter />)
        const suggestion = {ssn: null}
        const value = component.instance().renderSuggestion(suggestion)
        expect(shallow(value).html()).not.toContain('SSN')
      })
    })

    describe('address', () => {
      it('gets rendered', () => {
        const component = shallow(<Autocompleter />)
        const suggestion = {
          address: {
            id: 1,
            street_address: '234 Fake Street',
            city: 'Flushing',
            state: 'NM',
            zip: 11344,
            type: 'School',
          },
        }
        const value = component.instance().renderSuggestion(suggestion)
        expect(shallow(value).html()).toContain('<div><i class="fa fa-map-marker c-gray half-pad-right"></i><strong class="c-gray half-pad-right">School</strong><span>234 Fake Street, Flushing, NM 11344</span></div>')
      })

      it('gets rendered correctly when partial address is given', () => {
        const component = shallow(<Autocompleter />)
        const suggestion = {
          address: {
            id: 1,
            street_address: null,
            city: null,
            state: 'NM',
            zip: 11344,
            type: null,
          },
        }
        const value = component.instance().renderSuggestion(suggestion)
        expect(shallow(value).html()).toContain('<div><i class="fa fa-map-marker c-gray half-pad-right"></i><span>NM 11344</span></div>')
      })
    })
  })

  describe('#renderSuggestionsContainer', () => {
    it('rendres the suggestions container', () => {
      const component = shallow(<Autocompleter />)
      const container = component.instance().renderSuggestionsContainer({children: 'foobar', className: 'baz'})
      expect(shallow(container).html()).toBe('<div class="baz">foobar</div>')
    })
  })
})

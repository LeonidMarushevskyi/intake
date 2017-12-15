import Autocompleter from 'common/Autocompleter'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import {shallow, mount} from 'enzyme'

describe('<Autocompleter />', () => {
  function renderAutocompleter({
    onSelect = () => null,
    onClear = () => null,
    isSelectable = () => true,
    onSearch = () => null,
    onChange = () => null,
    searchTerm = '',
    results = [],
    total,
  }) {
    return shallow(
      <Autocompleter
        onSelect={onSelect}
        onClear={onClear}
        onChange={onChange}
        isSelectable={isSelectable}
        total={total}
        results={results}
        searchTerm={searchTerm}
        onSearch={onSearch}
      />
    )
  }

  function mountAutocompleter({
    searchTerm = '',
    onChange = () => null,
    onClear = () => null,
    onSearch = () => null,
    footer,
    results = [],
    total = 25,
  }) {
    return mount(
      <Autocompleter
        searchTerm={searchTerm}
        onChange={onChange}
        onClear={onClear}
        onSearch={onSearch}
        footer={footer}
        results={results}
        total={total}
      />
    )
  }

  it('renders a Autosuggest component', () => {
    expect(renderAutocompleter({}).find(ReactAutosuggest).length).toBe(1)
  })

  describe('#onSuggestionSelected', () => {
    let onSelect
    let onClear
    let onChange
    let component
    beforeEach(() => {
      onSelect = jasmine.createSpy('onSelectSpy')
      onClear = jasmine.createSpy('onClear')
      onChange = jasmine.createSpy('onChange')
      component = renderAutocompleter({onSelect, onClear, onChange})
    })
    describe('selection is selectable', () => {
      let isSelectable
      beforeEach(() => {
        isSelectable = jasmine.createSpy('isSelectable')
        onClear = jasmine.createSpy('onClear')
        onChange = jasmine.createSpy('onChang')
        component = renderAutocompleter({
          onSelect, onClear, isSelectable, onChange,
        })
      })
      describe('with permission to add sensitive', () => {
        it('clears the search Text and adds the suggestion', () => {
          isSelectable.and.returnValue(true)
          const suggestion = {id: '1'}
          component.instance().onSuggestionSelected('selected', {suggestion: suggestion})
          expect(onSelect.calls.argsFor(0)[0]).toEqual(suggestion)
          expect(onClear).toHaveBeenCalled()
          expect(onChange).toHaveBeenCalledWith('')
        })
      })
      describe('without permission to add sensitive', () => {
        it('skips onSelect and does not clear suggestions', () => {
          isSelectable.and.returnValue(false)
          const suggestion = {id: '1'}
          component.instance().onSuggestionSelected('selected', {suggestion: suggestion})
          expect(onSelect).not.toHaveBeenCalled()
        })
      })
    })
    describe('selection is a component', () => {
      it('skips onSelect for component selections', () => {
        const suggestion = (<p>footer</p>)
        component.instance().onSuggestionSelected(null, {suggestion})
        expect(onSelect).not.toHaveBeenCalled()
        expect(onClear).toHaveBeenCalled()
        expect(onChange).toHaveBeenCalledWith('')
      })
    })
    it('clears the search Text and adds the suggestion', () => {
      const suggestion = {id: '1'}
      component.instance().onSuggestionSelected('selected', {suggestion})
      expect(onSelect.calls.argsFor(0)[0]).toEqual(suggestion)
      expect(onClear).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith('')
    })
  })

  describe('#onSuggestionsClearRequested', () => {
    it('pass onClear to ReactAutoSuggest', () => {
      const onClear = jasmine.createSpy('onClear')
      const component = renderAutocompleter({onClear}).find(ReactAutosuggest)
      expect(component.props().onSuggestionsClearRequested).toEqual(onClear)
    })
  })

  describe('#getSuggestionValue', () => {
    it('return the suggestion to display on the input field', () => {
      const suggestion = {firstName: 'Bart', lastName: 'Simpson'}
      const suggestionValue = renderAutocompleter({})
        .instance().getSuggestionValue(suggestion)
      expect(suggestionValue).toBe('Bart Simpson')
    })
  })

  describe('with footer', () => {
    const footer = (<p>Test Footer</p>)

    it('has no footer displayed when closed', () => {
      const component = mountAutocompleter({searchTerm: 'Te', footer, results: []})
      expect(component.html()).not.toContain('Test Footer')
    })

    it('renders the footer when open', () => {
      const component = mountAutocompleter({searchTerm: 'Te', footer, results: []})
      component.find('input').simulate('focus')
      expect(component.html()).toContain('Test Footer')
    })
  })

  describe('#shouldRenderSuggestions', () => {
    const instance = renderAutocompleter({}).instance()
    it('returns true when search value contains two non whitespace characters', () => {
      expect(instance.shouldRenderSuggestions('aa')).toEqual(true)
    })

    it('returns true when search value contains a character then a whitespace', () => {
      expect(instance.shouldRenderSuggestions('a ')).toEqual(true)
    })

    it('returns false when search value contains two whitespace characters', () => {
      expect(instance.shouldRenderSuggestions('  ')).toEqual(false)
    })

    it('returns false when search value contains a whitespace then a character', () => {
      expect(instance.shouldRenderSuggestions(' a')).toEqual(false)
    })
  })

  describe('#renderSuggestion', () => {
    it('can render a component', () => {
      const element = mountAutocompleter({})
        .instance()
        .renderSuggestion(<p>render me</p>)
      expect(element.props.children).toEqual('render me')
    })

    it('renders the PersonSuggestion view', () => {
      const element = mountAutocompleter({})
        .instance()
        .renderSuggestion({firstName: 'test'})
      expect(element.props).toEqual({firstName: 'test'})
      expect(element.type.name).toEqual('PersonSuggestion')
    })
  })

  describe('#renderSuggestionsContainer', () => {
    const footer = (<span>Footer</span>)
    it('renders the suggestions container', () => {
      const component = renderAutocompleter({footer, searchTerm: 'Te'})
        .instance()
        .renderSuggestionsContainer({children: 'foobar', className: 'baz'})
      expect(shallow(component).find('div.baz').html()).toContain('foobar')
    })

    it('renders no results were found', () => {
      const component = renderAutocompleter({footer, total: 0, searchTerm: 'Simpson'})
      expect(component.html()).toContain('No results were found for &quot;Simpson&quot;')
    })

    it('renders number of results found', () => {
      const component = renderAutocompleter({footer, total: 2, searchTerm: 'Simpson'})
        .instance()
        .renderSuggestionsContainer({children: 'foobar', className: 'baz'})
      expect(shallow(component).find('div.baz').html()).toContain('Showing 1-2 of 2 results for &quot;Simpson&quot;')
    })
  })
})

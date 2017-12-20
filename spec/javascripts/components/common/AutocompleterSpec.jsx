import Autocompleter from 'common/Autocompleter'
import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import {shallow} from 'enzyme'

describe('<Autocompleter />', () => {
  function renderAutocompleter({
    onSelect = () => null,
    onClear = () => null,
    isSelectable = () => true,
    onSearch = () => null,
    onChange = () => null,
    searchTerm = '',
    results = [],
    footers = null,
    total = 0,
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
        footers={footers}
        onSearch={onSearch}
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
    let isSelectable
    const suggestion = {id: '1'}

    describe('when a suggestion is selectable', () => {
      beforeEach(() => {
        onSelect = jasmine.createSpy('onSelectSpy')
        onClear = jasmine.createSpy('onClear')
        onChange = jasmine.createSpy('onChange')
        isSelectable = jasmine.createSpy('isSelectable')
          .and.returnValue(true)
        renderAutocompleter({
          onSelect,
          onClear,
          onChange,
          isSelectable,
        }).instance()
          .onSuggestionSelected('selected', {suggestion})
      })

      it('clears the results', () => {
        expect(onClear).toHaveBeenCalled()
      })

      it('clears the search field', () => {
        expect(onChange).toHaveBeenCalledWith('')
      })

      it('calls onSelect with the selected result', () => {
        expect(onSelect).toHaveBeenCalledWith(suggestion)
      })
    })

    describe('when a suggestion is not selectable', () => {
      beforeEach(() => {
        onSelect = jasmine.createSpy('onSelectSpy')
        onClear = jasmine.createSpy('onClear')
        onChange = jasmine.createSpy('onChange')
        isSelectable = jasmine.createSpy('isSelectable')
          .and.returnValue(false)
        renderAutocompleter({
          onSelect,
          onClear,
          onChange,
          isSelectable,
        }).instance()
          .onSuggestionSelected('selected', {suggestion})
      })

      it('does nothing', () => {
        expect(onClear).not.toHaveBeenCalled()
        expect(onChange).not.toHaveBeenCalledWith('')
        expect(onSelect).not.toHaveBeenCalledWith(suggestion)
      })
    })
  })

  describe('#onSuggestionsClearRequested', () => {
    it('pass onClear to ReactAutoSuggest', () => {
      const onClear = jasmine.createSpy('onClear')
      const component = renderAutocompleter({onClear}).find(ReactAutosuggest)
      expect(component.props().onSuggestionsClearRequested).toEqual(onClear)
    })
  })

  describe('#renderSuggestionsContainer', () => {
    it('renders the suggestions header', () => {
      const suggestionHeader = renderAutocompleter({searchTerm: 'Te'})
        .dive('SuggestionHeader')
      expect(suggestionHeader.exists()).toEqual(true)
    })

    it('renders no results were found', () => {
      const suggestionHeader = renderAutocompleter({total: 0, searchTerm: 'Simpson'})
        .dive('SuggestionHeader')
      expect(suggestionHeader.html()).toContain('No results were found for &quot;Simpson&quot;')
    })

    it('renders number of results found', () => {
      const fiveResults = Array.from(Array(5).keys()).map(() => ({}))
      const suggestionHeader = renderAutocompleter({
        results: fiveResults,
        total: 10,
        searchTerm: 'Simpson',
      }).dive('SuggestionHeader')
      expect(suggestionHeader.html()).toContain('Showing 1-5 of 10 results for &quot;Simpson&quot;')
    })

    it('renders the suggestions footers', () => {
      const footers = [<p key='footer-1' className='footer-1'>Footer #1</p>]
      const footer = renderAutocompleter({searchTerm: 'Te', footers})
        .dive('.footer-1')
      expect(footer.html()).toContain('Footer #1')
    })
  })
})

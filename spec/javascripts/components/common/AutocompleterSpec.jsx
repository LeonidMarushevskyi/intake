import Autocompleter from 'common/Autocompleter'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('<Autocompleter />', () => {
  function mountAutocompleter({
    onSelect = () => null,
    onClear = () => null,
    isSelectable = () => true,
    onSearch = () => null,
    onChange = () => null,
    searchTerm = '',
    results = [],
    footer = null,
    total = 0,
  }) {
    return mount(
      <Autocompleter
        onSelect={onSelect}
        onClear={onClear}
        onChange={onChange}
        isSelectable={isSelectable}
        total={total}
        results={results}
        searchTerm={searchTerm}
        footer={footer}
        onSearch={onSearch}
      />
    )
  }
  function renderAutocompleter({
    onSelect = () => null,
    onClear = () => null,
    isSelectable = () => true,
    onSearch = () => null,
    onChange = () => null,
    searchTerm = '',
    results = [],
    footer = null,
    total = 0,
    id = null,
  }) {
    return shallow(
      <Autocompleter
        id={id}
        onSelect={onSelect}
        onClear={onClear}
        onChange={onChange}
        isSelectable={isSelectable}
        total={total}
        results={results}
        searchTerm={searchTerm}
        footer={footer}
        onSearch={onSearch}
      />
    )
  }

  describe('#onItemSelect', () => {
    let onClear
    let onChange
    let onSelect
    const item = {legacyDescriptor: {legacy_id: 1}}
    const results = [item]
    beforeEach(() => {
      onClear = jasmine.createSpy('onClear')
      onChange = jasmine.createSpy('onChange')
      onSelect = jasmine.createSpy('onSelect')
    })

    describe('when an item is selectable', () => {
      beforeEach(() => {
        const autocompleter = mountAutocompleter({
          results, searchTerm: 'te', onClear, onChange, onSelect,
        })
        autocompleter.find('input').simulate('focus')
        autocompleter.find('div[id="search-result-1"]')
          .first()
          .simulate('click', null)
      })

      it('clears the results', () => {
        expect(onClear).toHaveBeenCalled()
      })

      it('clears the search field', () => {
        expect(onChange).toHaveBeenCalledWith('')
      })

      it('calls onSelect with the selected result', () => {
        expect(onSelect).toHaveBeenCalledWith(item)
      })
    })

    describe('when an item is not selectable', () => {
      beforeEach(() => {
        const isSelectable = jasmine.createSpy('isSelectable')
        isSelectable.and.returnValue(false)
        const autocompleter = mountAutocompleter({
          results, searchTerm: 'te', onClear, onChange, onSelect,
          isSelectable,
        })
        autocompleter.find('input').simulate('focus')
        autocompleter.find('div[id="search-result-1"]')
          .first()
          .simulate('click', null)
      })

      it('does nothing', () => {
        expect(onClear).not.toHaveBeenCalled()
        expect(onChange).not.toHaveBeenCalled()
        expect(onSelect).not.toHaveBeenCalled()
      })
    })
  })

  describe('onChange', () => {
    let searchInput
    let onSearch
    let onChange
    beforeEach(() => {
      onSearch = jasmine.createSpy('onSearch')
      onChange = jasmine.createSpy('onChange')
      searchInput = renderAutocompleter({onSearch, onChange})
        .dive()
        .find('input')
    })
    describe('when user types to non whitespace characters', () => {
      const value = 'aa'
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('performs a search', () => {
        expect(onSearch).toHaveBeenCalledWith(value)
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith(value)
      })
    })
    describe('when search value contains a character then a whitespace', () => {
      const value = 'a '
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('performs a search', () => {
        expect(onSearch).toHaveBeenCalledWith(value)
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith(value)
      })
    })
    describe('when search value contains two whitespace characters', () => {
      const value = '  '
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('does not perform a search', () => {
        expect(onSearch).not.toHaveBeenCalled()
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith(value)
      })
    })
    describe('when search value contains a whitespace then a character', () => {
      const value = ' a'
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('does not perform a search', () => {
        expect(onSearch).not.toHaveBeenCalled()
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith(value)
      })
    })
  })

  describe('render', () => {
    it('displays an Autocomplete component', () => {
      const autocomplete = renderAutocompleter({
        id: 'search-input-id',
      }).find('Autocomplete')
      expect(autocomplete.length).toBe(1)

      const input = autocomplete.dive().find('input')
      expect(input.props().id).toEqual('search-input-id')
    })

    describe('with search results present', () => {
      const address = {id: 'test address'}
      const ethnicity = {id: 'test ethnicity'}
      const languages = ['test languages']
      const phoneNumber = {id: 'test phone number'}
      const races = ['test race']
      const legacyDescriptor = {legacy_id: 'some-legacy-id'}
      const results = [{
        address,
        dateOfBirth: 'test date of birth',
        ethnicity,
        firstName: 'test first name',
        gender: 'male',
        isSealed: false,
        isSensitive: false,
        languages,
        lastName: 'test last name',
        legacyDescriptor,
        middleName: 'test middle name',
        phoneNumber,
        races,
        ssn: 'test ssn',
      }]
      let autocompleter
      beforeEach(() => {
        autocompleter = mountAutocompleter({results})
        autocompleter.find('input').simulate('focus')
      })

      it('displays person suggestion', () => {
        const sugestion = autocompleter.find('PersonSuggestion')
        expect(sugestion.length).toBe(1)

        expect(sugestion.props().address).toEqual(address)
        expect(sugestion.props().dateOfBirth).toEqual('test date of birth')
        expect(sugestion.props().ethnicity).toEqual(ethnicity)
        expect(sugestion.props().firstName).toEqual('test first name')
        expect(sugestion.props().gender).toEqual('male')
        expect(sugestion.props().isSealed).toEqual(false)
        expect(sugestion.props().isSensitive).toEqual(false)
        expect(sugestion.props().languages).toEqual(languages)
        expect(sugestion.props().lastName).toEqual('test last name')
        expect(sugestion.props().legacyDescriptor).toEqual(legacyDescriptor)
        expect(sugestion.props().middleName).toEqual('test middle name')
        expect(sugestion.props().phoneNumber).toEqual(phoneNumber)
        expect(sugestion.props().races).toEqual(races)
        expect(sugestion.props().ssn).toEqual('test ssn')
      })

      it('changes backround colour when highlighted', () => {
        const input = autocompleter.find('input')
        input.simulate('keyDown', { key : 'ArrowDown', keyCode: 40, which: 40 })
        const result = autocompleter.find('div[id="search-result-some-legacy-id"]')
        expect(result.props().style.backgroundColor).toEqual('#d4d4d4')
      })
    })

    it('displays no results were found', () => {
      const autocompleter = mountAutocompleter({total: 0, searchTerm: 'Simpson'})
      autocompleter.find('input').simulate('focus')
      const suggestionHeader = autocompleter.find('SuggestionHeader')
      expect(suggestionHeader.html()).toContain('No results were found for "Simpson"')
    })

    it('displays number of results found', () => {
      const fiveResults = Array.from(Array(5).keys()).map((id) => ({legacyDescriptor: {legacy_id: id}}))
      const autocompleter = mountAutocompleter({
        results: fiveResults,
        total: 10,
        searchTerm: 'Simpson',
      })
      autocompleter.find('input').simulate('focus')
      const suggestionHeader = autocompleter.find('SuggestionHeader')
      expect(suggestionHeader.html()).toContain('Showing 1-5 of 10 results for "Simpson"')
    })

    it('displays the footer', () => {
      const footer = <p className='footer-1'>Footer #1</p>
      const autocompleter = mountAutocompleter({searchTerm: 'Te', footer})
      autocompleter.find('input').simulate('focus')
      expect(autocompleter.html()).toContain('Footer #1')
    })
  })
})

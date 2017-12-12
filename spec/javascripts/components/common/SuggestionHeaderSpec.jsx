import React from 'react'
import {shallow} from 'enzyme'
import SuggestionHeader from 'common/SuggestionHeader'

describe('SuggestionHeader', () => {
  function renderSuggestionHeader({total, currentNumberOfResults}) {
    return shallow(
      <SuggestionHeader
        searchTerm={'search term'}
        total={total}
        currentNumberOfResults={currentNumberOfResults}
      />
    )
  }
  it('renders no results copy when total is 0', () => {
    const component = renderSuggestionHeader({total: 0})
    expect(component.text()).toContain('No results were found for "search term"')
  })

  it('renders the current and total number of results', () => {
    const component = renderSuggestionHeader({currentNumberOfResults: 25, total: 50})
    expect(component.text()).toContain('Showing 1-25 of 50 results for "search term"')
  })
})

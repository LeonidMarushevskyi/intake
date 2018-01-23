import AutocompleterFooter from 'common/AutocompleterFooter'
import React from 'react'
import {shallow} from 'enzyme'

describe('<AutocompleterFooter />', () => {
  function renderAutocompleterFooter({
    canCreateNewPerson,
    canLoadMoreResults,
    onCreateNewPerson = () => null,
    onLoadMoreResults = () => null,
  }) {
    return shallow(
      <AutocompleterFooter
        canCreateNewPerson={canCreateNewPerson}
        canLoadMoreResults={canLoadMoreResults}
        onCreateNewPerson={onCreateNewPerson}
        onLoadMoreResults={onLoadMoreResults}
      />, {disableLifecycleMethods: true}
    )
  }

  it('does not render ShowMoreResults when cannot load more results', () => {
    const component = renderAutocompleterFooter({canLoadMoreResults: false})
      .find('ShowMoreResults')
    expect(component.exists()).toEqual(false)
  })

  it('does not render CreateUnknownPerson when cannnot create new person', () => {
    const component = renderAutocompleterFooter({canCreateNewPerson: false})
      .find('CreateUnknownPerson')
    expect(component.exists()).toEqual(false)
  })

  it('renders ShowMoreResults when can load more results', () => {
    const onLoadMoreResults = jasmine.createSpy('onLoadMoreResults')
    const component = renderAutocompleterFooter({
      canLoadMoreResults: true,
      onLoadMoreResults,
    }).find('ShowMoreResults')
    expect(component.exists()).toEqual(true)
    expect(component.props().onClick).toEqual(onLoadMoreResults)
  })

  it('renders CreateUnknownPerson when can create new person', () => {
    const onCreateNewPerson = jasmine.createSpy('onCreateNewPerson')
    const component = renderAutocompleterFooter({
      canCreateNewPerson: true,
      onCreateNewPerson,
    }).find('CreateUnknownPerson')
    expect(component.exists()).toEqual(true)
    expect(component.props().onClick).toEqual(onCreateNewPerson)
  })
})

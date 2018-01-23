import React from 'react'
import {shallow} from 'enzyme'
import PersonSearchForm from 'views/people/PersonSearchForm'
import * as IntakeConfig from 'common/config'

describe('PersonSearchForm', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
  })

  function renderPersonSearchForm({
    onSelect = () => null,
    onChange = () => null,
    onClear = () => null,
    ...args
  }) {
    const props = {onSelect, onChange, onClear, ...args}
    return shallow(<PersonSearchForm {...props}/>, {disableLifecycleMethods: true})
  }

  it('componentWillUnmount', () => {
    const onClear = jasmine.createSpy('onClear')
    const onChange = jasmine.createSpy('onChange')
    const component = renderPersonSearchForm({onClear, onChange})
    component.unmount()
    expect(onClear).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalled()
  })

  it('renders a card anchor', () => {
    const component = renderPersonSearchForm({})
    expect(component.find('.anchor').exists()).toBe(true)
  })

  it('renders the autocompleter', () => {
    const component = renderPersonSearchForm({})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.exists()).toEqual(true)
    expect(autocompleter.props().id).toEqual('screening_participants')
  })

  it('passes isSelectable from props to the autocompleter', () => {
    const isSelectable = jasmine.createSpy('isSelectable')
    const component = renderPersonSearchForm({isSelectable})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.props().isSelectable).toEqual(isSelectable)
  })

  it('passes the onSelect prop to the autocompleter', () => {
    const onSelect = jasmine.createSpy('onSelect')
    const component = renderPersonSearchForm({onSelect})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.props().onSelect).toEqual(onSelect)
  })

  it('renders the card header', () => {
    const component = renderPersonSearchForm({})
    expect(component.find('.card-header').children('span').text()).toContain('Search')
  })

  it('renders the search prompt', () => {
    const component = renderPersonSearchForm({searchPrompt: 'Search for any person'})
    const searchCard = component.find('#search-card')
    const label = searchCard.children('.card-body').children('div').children('div').children('label')
    expect(label.text()).toContain('Search for any person')
  })
})

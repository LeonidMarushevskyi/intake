import React from 'react'
import {shallow} from 'enzyme'
import PersonSearchForm from 'views/people/PersonSearchForm'
import CreateUnknownPerson from 'screenings/CreateUnknownPerson'
import * as IntakeConfig from 'common/config'

describe('PersonSearchForm', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
  })

  function renderPersonSearchForm({
    onSelect = () => null,
    isSelectable,
    canCreateNewPerson,
  }) {
    return shallow(
      <PersonSearchForm
        onSelect={onSelect}
        isSelectable={isSelectable}
        canCreateNewPerson={canCreateNewPerson}
      />
    )
  }

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

  describe('when creating a new person is allowed', () => {
    let onSelect
    let autocompleter
    beforeEach(() => {
      onSelect = jasmine.createSpy('onSelect')
      autocompleter = renderPersonSearchForm({
        canCreateNewPerson: true,
        onSelect,
      }).find('Autocompleter')
    })

    it('renders autocompleter with CreateUnknownPerson footer', () => {
      expect(autocompleter.props().footers).toContain(
        <CreateUnknownPerson key='create-unknown-person' saveCallback={onSelect}/>
      )
    })
  })

  describe('when creating a new person is NOT allowed', () => {
    let component
    let onSelect
    beforeEach(() => {
      onSelect = jasmine.createSpy('onSelect')
      component = renderPersonSearchForm({canCreateNewPerson: false})
    })

    it('does not pass the CreateUnknownPerson footer', () => {
      const autocompleter = component.find('Autocompleter')
      expect(autocompleter.props().footers).not.toContain(
        <CreateUnknownPerson saveCallback={onSelect}/>
      )
    })
  })

  it('renders the card header', () => {
    const component = renderPersonSearchForm({})
    expect(component.children('.card-header').children('span').text()).toContain('Search')
  })

  describe('search card', () => {
    it('is labeled as "search for any person" in hotline', () => {
      const component = renderPersonSearchForm({})
      const searchCard = component.find('#search-card')
      const label = searchCard.children('.card-body').children('div').children('div').children('label')
      expect(label.text()).toContain('Search for any person')
      expect(label.text()).toContain('(Children, parents, collaterals, reporters, alleged perpetrators...)')
    })

    it('is labeled as "search for clients" in snapshot', () => {
      IntakeConfig.isFeatureInactive.and.returnValue(false)
      IntakeConfig.isFeatureActive.and.returnValue(true)
      const component = renderPersonSearchForm({})
      const searchCard = component.find('#search-card')
      const label = searchCard.children('.card-body').children('div').children('div').children('label')
      expect(label.text()).toContain('Search for clients')
    })
  })
})

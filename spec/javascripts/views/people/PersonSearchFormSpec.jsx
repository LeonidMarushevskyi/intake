import React from 'react'
import {shallow} from 'enzyme'
import PersonSearchForm from 'views/people/PersonSearchForm'
import CreateUnknownParticipant from 'screenings/CreateUnknownParticipant'

describe('PersonSearchForm', () => {
  const renderPersonSearchForm = ({...props}) => (
    shallow(<PersonSearchForm {...props}/>)
  )

  it('renders the autocompleter', () => {
    const component = renderPersonSearchForm({})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.exists()).toEqual(true)
    expect(autocompleter.props().id).toEqual('screening_participants')
  })

  it('passes isSelectable from props to the autocompleter', () => {
    const isSelectable = () => {}
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

  it('passes the footer if we can create new people', () => {
    const onSelect = () => {}
    const component = renderPersonSearchForm({canCreateNewPerson: true, onSelect})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.props().footer).toEqual(<CreateUnknownParticipant saveCallback={onSelect}/>)
  })

  it('does not pass a footer if we cannot create new people', () => {
    const component = renderPersonSearchForm({canCreateNewPerson: false})
    const autocompleter = component.find('Autocompleter')
    expect(autocompleter.props().footer).toEqual(false)
  })

  it('renders the card header', () => {
    const component = renderPersonSearchForm({})
    expect(component.children('.card-header').children('span').text()).toContain('Search')
  })

  it('renders the search card', () => {
    const component = renderPersonSearchForm({})
    const searchCard = component.find('#search-card')
    const label = searchCard.children('.card-body').children('div').children('div').children('label')
    expect(label.text()).toContain('Search for clients')
  })
})

import Immutable from 'immutable'
import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import {shallow} from 'enzyme'

describe('NarrativeShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    component = shallow(<NarrativeShowView narrative={'some narrative'} onEdit={onEdit} />)
  })

  it('renders a show card with narative-card as id', () => {
    expect(component.props().id).toEqual('narrative-card')
    expect(component.props().className).toContain('show')
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toContain('Narrative')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit narrative')
  })

  it('renders the narrative label', () => {
    const label = component.find('label')
    expect(label.length).toEqual(1)
    expect(label.text()).toEqual('Report Narrative')
  })

  it('renders the narrative value', () => {
    expect(component.text()).toContain('some narrative')
  })

  it('calls the onEdit function when edit link is clicked', () => {
    component.find('EditLink').simulate('click')
    expect(onEdit).toHaveBeenCalled()
  })
})

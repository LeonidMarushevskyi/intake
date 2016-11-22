import Immutable from 'immutable'
import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import {shallow} from 'enzyme'

describe('NarrativeShowView', () => {
  let wrapper
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    wrapper = shallow(<NarrativeShowView narrative={'some narrative'} onEdit={onEdit} />)
  })

  it('renders a show card with narative-card as id', () => {
    expect(wrapper.props().id).toEqual('narrative-card')
    expect(wrapper.props().className).toContain('show')
  })

  it('renders the card header', () => {
    expect(wrapper.find('.card-header').text()).toContain('Narrative')
  })

  it('renders the edit link', () => {
    expect(wrapper.find('EditLink').props().ariaLabel).toEqual('Edit narrative')
  })

  it('renders the narrative label', () => {
    const label = wrapper.find('label')
    expect(label.length).toEqual(1)
    expect(label.text()).toEqual('Report Narrative')
  })

  it('renders the narrative value', () => {
    expect(wrapper.text()).toContain('some narrative')
  })

  it('calls the onEdit function when edit link is clicked', () => {
    wrapper.find('EditLink').simulate('click')
    expect(onEdit).toHaveBeenCalled()
  })
})

import Immutable from 'immutable'
import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import {shallow} from 'enzyme'

describe('narrative card', () => {
  let wrapper
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    wrapper = shallow(<NarrativeShowView screening={Immutable.Map({})} onEdit={onEdit} />)
  })

  it('renders a show card with narative-card as id', () => {
    expect(wrapper.props().id).toEqual('narrative-card')
    expect(wrapper.props().className).toContain('show')
  })

  it('renders the edit link within narrative card', () => {
    expect(wrapper.find('a').length).toEqual(1)
  })

  it('renders the card header', () => {
    expect(wrapper.find('.card-header').text()).toContain('Narrative')
  })

  it('renders the edit link', () => {
    expect(wrapper.find('.fa-pencil').length).toEqual(1)
  })

  it('renders the narrative label', () => {
    const label = wrapper.find('label')
    expect(label.length).toEqual(1)
    expect(label.text()).toEqual('Report Narrative')
  })

  it('renders the narrative value', () => {
    const screening = Immutable.Map({report_narrative: 'some narrative'})
    wrapper = shallow(<NarrativeShowView screening={screening} />)
    expect(wrapper.text()).toContain('some narrative')
  })

  it('calls the onEdit function when "Edit narrative" is clicked', () => {
    wrapper.find('a[aria-label="Edit narrative"]').simulate('click')
    expect(onEdit).toHaveBeenCalled()
  })
})

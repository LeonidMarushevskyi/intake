import Immutable from 'immutable'
import React from 'react'
import NarrativeShowView from 'components/screenings/NarrativeShowView'
import {shallow} from 'enzyme'

describe('narrative card', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<NarrativeShowView screening={Immutable.Map({})} />)
  })

  it('renders the card header', () => {
    expect(wrapper.find('.card-header').text()).toContain('Narrative')
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
})

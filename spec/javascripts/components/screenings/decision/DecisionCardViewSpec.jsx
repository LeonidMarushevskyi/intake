import React from 'react'
import DecisionCardView from 'screenings/DecisionCardView'
import {shallow} from 'enzyme'

describe('DecisionCardView', () => {
  it('changes mode to edit if original state is show', () => {
    const component = shallow(<DecisionCardView mode='show' />)
    component.instance().toggleMode()
    expect(component.state().mode).toEqual('edit')
  })

  it('changes mode to show if original state is edit', () => {
    const component = shallow(<DecisionCardView mode='edit' />)
    component.instance().toggleMode()
    expect(component.state().mode).toEqual('show')
  })

  it('renders the show view', () => {
    const component = shallow(<DecisionCardView mode='show' />)
    expect(component.find('Connect(ScreeningDecisionShow)').exists()).toEqual(true)
  })

  it('renders the edit view', () => {
    const component = shallow(<DecisionCardView mode='edit' />)
    expect(component.find('Connect(ScreeningDecisionForm)').exists()).toEqual(true)
  })
})

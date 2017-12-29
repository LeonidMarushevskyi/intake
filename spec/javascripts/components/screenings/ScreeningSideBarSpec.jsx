import React from 'react'
import {shallow} from 'enzyme'
import ScreeningSideBar from 'screenings/ScreeningSideBar'

describe('ScreeningSideBar', () => {
  let component
  beforeEach(() => {
    component = shallow(<ScreeningSideBar />)
  })

  it('renders the div wrapper', () => {
    expect(component.find('div.col-md-2').exists()).toBe(true)
  })

  it('renders the SideBar component', () => {
    expect(component.find('SideBar').exists()).toBe(true)
  })

  it('renders a link to the Screening Information card', () => {
    expect(component.find('NavLink[text="Screening Information"]').props().href)
      .toBe('#screening-information-card')
  })

  describe('People & Roles', () => {
    it('renders a link to the People Search card', () => {
      expect(component.find('NavLink[text="People & Roles"]').props().href
      ).toBe('#search-card')
    })
  })

  it('renders a link to the Narrative card', () => {
    expect(component.find('NavLink[text="Narrative"]').props().href)
      .toBe('#narrative-card')
  })

  it('renders a link to the Incident Information card', () => {
    expect(component.find('NavLink[text="Incident Information"]').props().href)
      .toBe('#incident-information-card')
  })

  it('renders a link to the Allegations card', () => {
    expect(component.find('NavLink[text="Allegations"]').props().href)
      .toBe('#allegations-card')
  })

  it('renders a link to the Relationships card', () => {
    expect(component.find('NavLink[text="Relationships"]').props().href)
      .toBe('#relationships-card')
  })

  it('renders a link to the Worker Safety card', () => {
    expect(component.find('NavLink[text="Worker Safety"]').props().href)
      .toBe('#worker-safety-card')
  })

  it('renders a link to the History card', () => {
    expect(component.find('NavLink[text="History"]').props().href)
      .toBe('#history-card')
  })

  it('renders a link to the Cross Report card', () => {
    expect(component.find('NavLink[text="Cross Report"]').props().href)
      .toBe('#cross-report-card')
  })

  it('renders a link to the Decision card', () => {
    expect(component.find('NavLink[text="Decision"]').props().href)
      .toBe('#decision-card')
  })
})

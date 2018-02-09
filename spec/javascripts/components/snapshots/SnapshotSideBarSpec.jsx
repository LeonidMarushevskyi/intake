import React from 'react'
import {shallow} from 'enzyme'
import SnapshotSideBar from 'snapshots/SnapshotSideBar'

describe('SnapshotSideBar', () => {
  let component
  beforeEach(() => {
    component = shallow(<SnapshotSideBar />)
  })

  it('renders the div wrapper', () => {
    expect(component.find('div.col-md-2').exists()).toBe(true)
  })

  it('renders the SideBar component', () => {
    expect(component.find('SideBar').exists()).toBe(true)
  })

  describe('People & Roles', () => {
    it('renders a link to the People Search card', () => {
      expect(component.find('NavLink[text="People & Roles"]').props().href
      ).toBe('#search-card-anchor')
    })
  })

  it('renders a link to the History card', () => {
    expect(component.find('NavLink[text="History"]').props().href)
      .toBe('#history-card-anchor')
  })
})


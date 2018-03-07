import React from 'react'
import {shallow} from 'enzyme'
import SnapshotSideBar from 'snapshots/SnapshotSideBar'

describe('SnapshotSideBar', () => {
  let component
  const participants = [{id: '23', first_name: 'Ultra', last_name: 'Goku', middle_name: 'Instinct', name_suffix: ''}]
  beforeEach(() => {
    component = shallow(<SnapshotSideBar participants={participants} />)
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

    it('renders a link to the People selected from search', () => {
      expect(component.find('NavLink[text="Ultra Instinct Goku"]').exists()).toBe(true)
      expect(component.find('NavLink[text="Ultra Instinct Goku"]').props().href
      ).toBe('#participants-card-23')
    })
  })

  it('renders a link to the History card', () => {
    expect(component.find('NavLink[text="History"]').props().href)
      .toBe('#history-card-anchor')
  })
})


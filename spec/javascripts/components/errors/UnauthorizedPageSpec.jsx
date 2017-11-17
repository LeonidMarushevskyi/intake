import React from 'react'
import UnauthorizedPage from 'errors/UnauthorizedPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('UnauthorizedPage', () => {
  const dashboardUrl = 'my_dashboard_link'
  let component

  beforeEach(() => {
    spyOn(IntakeConfig, 'dashboardUrl').and.returnValue(dashboardUrl)
    component = shallow(<UnauthorizedPage/>)
  })

  it('renders the error text', () => {
    expect(component.text()).toContain('This page is restricted.')
    expect(component.text()).toContain("You don't have the appropriate permissions to view this page.Return to your dashboard")
  })

  it('renders a link to dashboard', () => {
    expect(component.find(`a[href="${dashboardUrl}"]`).length).toEqual(1)
  })
})

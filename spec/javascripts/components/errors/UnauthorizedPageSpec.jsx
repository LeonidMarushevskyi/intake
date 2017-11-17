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
    expect(component.text()).toContain('Sorry, you are restricted from accessing this page.')
    expect(component.text()).toContain('Return to your dashboard.')
  })

  it('renders a link to dashboard', () => {
    expect(component.find(`a[href="${dashboardUrl}"]`).length).toEqual(1)
  })
})

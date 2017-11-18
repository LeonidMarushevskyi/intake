import React from 'react'
import ForbiddenPage from 'errors/ForbiddenPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('ForbiddenPage', () => {
  const basePath = 'my_dashboard_link'
  let component

  beforeEach(() => {
    spyOn(IntakeConfig, 'basePath').and.returnValue(basePath)
    component = shallow(<ForbiddenPage/>)
  })

  it('renders the error text', () => {
    expect(component.text()).toContain('This page is restricted.')
    expect(component.text()).toContain("You don't have the appropriate permissions to view this page.Return to your dashboard")
  })

  it('renders a link to dashboard', () => {
    expect(component.find(`a[href="/${basePath}"]`).length).toEqual(1)
  })
})

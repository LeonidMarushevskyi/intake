import React from 'react'
import NotFoundPage from 'errors/NotFoundPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('NotFoundPage', () => {
  const dashboardUrl = 'my_dashboard_link'
  let component

  beforeEach(() => {
    spyOn(IntakeConfig, 'dashboardUrl').and.returnValue(dashboardUrl)
    component = shallow(<NotFoundPage/>)
  })

  it('renders the error text', () => {
    expect(component.text()).toContain('Sorry, this is not the page you want.')
    expect(component.text()).toContain(
      "It may have been deleted or doesn't exist. Please check the address orreturn to your dashboard."
    )
  })

  it('renders a link to dashboard', () => {
    expect(component.find(`a[href="${dashboardUrl}"]`).length).toEqual(1)
  })
})

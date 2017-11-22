import React from 'react'
import ForbiddenPage from 'errors/ForbiddenPage'
import {shallow} from 'enzyme'

describe('ForbiddenPage', () => {
  let component

  beforeEach(() => {
    component = shallow(<ForbiddenPage/>)
  })

  it('renders the error text', () => {
    expect(component.text()).toContain('This page is restricted.')
    expect(component.text()).toContain(
      "You don't have the appropriate permissions to view this page."
    )
  })

  it('renders a link to dashboard', () => {
    expect(component.find('Link').props().to).toBe('/')
    expect(component.find('Link').props().children)
      .toBe('Return to your dashboard')
  })
})
